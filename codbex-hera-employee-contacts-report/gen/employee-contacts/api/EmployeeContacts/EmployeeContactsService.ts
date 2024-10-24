import { Controller, Get, Post } from "sdk/http"
import { EmployeeContactsRepository, EmployeeContactsFilter, EmployeeContactsPaginatedFilter } from "../../dao/EmployeeContacts/EmployeeContactsRepository";
import { HttpUtils } from "../utils/HttpUtils";

@Controller
class EmployeeContactsService {

    private readonly repository = new EmployeeContactsRepository();

    @Get("/")
    public filter(_: any, ctx: any) {
        try {
            const filter: EmployeeContactsPaginatedFilter = {
                FirstName: ctx.queryParameters.FirstName ? ctx.queryParameters.FirstName : undefined,
                "$limit": ctx.queryParameters["$limit"] ? parseInt(ctx.queryParameters["$limit"]) : undefined,
                "$offset": ctx.queryParameters["$offset"] ? parseInt(ctx.queryParameters["$offset"]) : undefined
            };

            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Get("/count")
    public count(_: any, ctx: any) {
        try {
            const filter: EmployeeContactsFilter = {
                FirstName: ctx.queryParameters.FirstName ? ctx.queryParameters.FirstName : undefined,
            };
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/count")
    public countWithFilter(filter: any) {
        try {
            return this.repository.count(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    @Post("/search")
    public search(filter: any) {
        try {
            return this.repository.findAll(filter);
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.name === "ForbiddenError") {
            HttpUtils.sendForbiddenRequest(error.message);
        } else if (error.name === "ValidationError") {
            HttpUtils.sendResponseBadRequest(error.message);
        } else {
            HttpUtils.sendInternalServerError(error.message);
        }
    }

}