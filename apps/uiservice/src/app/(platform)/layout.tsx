"use client"
import { endPoints } from "@/shared/constants/api-endpoints"
import { uiConstants } from "@/shared/constants/global-constants"
import { GlobalContext } from "@/context/globalstate.provider"
import ky from "ky"
import { ReactNode, useContext, useState } from "react"
import { toast } from "@/shared/components/ui/use-toast"
import Show from "@/shared/components/show"
import AuthProvider from "./auth"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { Subscription, User } from "@/shared/types"
import Loading from "../loading"
import { useQuery } from "@tanstack/react-query"
import Sidebar from "@/shared/components/sidebar"

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [{ refreshId }, dispatch] = useContext(GlobalContext)
  const [isAuthorized, setAuthorized] = useState<boolean>(false)

  const getUserDetails = async () => {
    if (!localStorage.getItem("accessToken")) {
      setAuthorized(false)
      return null
    } else {
      try {
        const response: {
          user: User
          subscription: Subscription | null
        } = await ky
          .get(endPoints.userDetails, { timeout: FETCH_TIMEOUT })
          .json()
        dispatch("setUser", response.user)
        dispatch("setSubscription", response.subscription)
        setAuthorized(true)
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 401) {
            setAuthorized(false)
          } else {
            toast({
              title: uiConstants.notification,
              description: (
                <p className="text-zinc-600">
                  {uiConstants.connectionErrorMessage}
                </p>
              ),
            })
          }
        } else {
          toast({
            title: uiConstants.notification,
            description: (
              <p className="text-zinc-600">
                {uiConstants.connectionErrorMessage}
              </p>
            ),
          })
        }
      } finally {
        return null
      }
    }
  }

  const { isLoading, isFetching } = useQuery({
    queryKey: ["user-details", refreshId, isAuthorized],
    queryFn: getUserDetails,
    refetchInterval: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })

  const appLayout = (
    <div className="min-h-screen w-full">
      <Sidebar />
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="p-4 sm:px-6 sm:py-0">{children}</div>
        </div>
      </div>
    </div>
  )

  return (
    <Show condition={!isLoading && !isFetching} fallback={<Loading />}>
      <Show condition={!isAuthorized} fallback={appLayout}>
        <AuthProvider onAuthorized={(auth: boolean) => setAuthorized(auth)} />
      </Show>
    </Show>
  )
}
