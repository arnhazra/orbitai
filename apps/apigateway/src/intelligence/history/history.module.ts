import { Module } from "@nestjs/common"
import { HistoryService } from "./history.service"
import { HistoryController } from "./history.controller"
import { HistoryRepository } from "./history.repository"
import { CqrsModule } from "@nestjs/cqrs"
import { DatabaseModule } from "@/shared/database/database.module"
import { DbConnectionMap } from "@/shared/utils/db-connection.map"
import { History, HistorySchema } from "./schemas/history.schema"
import { FindHistoryQueryHandler } from "./queries/handler/find-history.handler"
import { CreateHistoryCommandHandler } from "./commands/handler/create-history.handler"

@Module({
  imports: [
    CqrsModule,
    DatabaseModule.forFeature(
      [{ name: History.name, schema: HistorySchema }],
      DbConnectionMap.Platform
    ),
  ],
  controllers: [HistoryController],
  providers: [
    HistoryService,
    HistoryRepository,
    CreateHistoryCommandHandler,
    FindHistoryQueryHandler,
  ],
})
export class HistoryModule {}
