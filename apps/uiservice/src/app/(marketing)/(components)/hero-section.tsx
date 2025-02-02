import { buttonVariants } from "@/shared/components/ui/button"
import { uiConstants } from "@/shared/constants/global-constants"
import { cn } from "@/shared/lib/utils"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="container space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 hero-landing lg:rounded-lg">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-7xl tracking-tight">
          {uiConstants.homeHeader}
        </h1>
        <p className="max-w-[42rem] leading-normal text-white sm:text-xl sm:leading-8">
          {uiConstants.homeIntro1}
        </p>
        <Link
          href="/explore"
          className={cn(
            buttonVariants({
              size: "lg",
              variant: "secondary",
              className: "rounded-lg",
            })
          )}
        >
          {uiConstants.getStartedButton}
        </Link>
      </div>
    </section>
  )
}
