import { Query, NamedQueryParameter } from "sdk/db";

export interface PayrollsSummary {
    readonly 'Net salary': number;
    readonly 'Taxes': number;
    readonly 'Start date': Date;
    readonly 'Pay date': Date;
    readonly 'Name': string;
    readonly 'Status': string;
}

export interface PayrollsSummaryFilter {
    readonly 'StartDate?': string;
}

export interface PayrollsSummaryPaginatedFilter extends PayrollsSummaryFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class PayrollsSummaryRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: PayrollsSummaryPaginatedFilter): PayrollsSummary[] {
        const sql = `
            SELECT PayrollEntry.PAYROLLENTRY_NETSALARY as "Net salary", PayrollEntry.PAYROLLENTRY_TAXES as "Taxes", PayrollEntry.PAYROLLENTRY_STARTDATE as "Start date", PayrollEntry.PAYROLLENTRY_PAYDATE as "Pay date", Employee.EMPLOYEE_NAME as "Name", PayrollStatus.PAYROLLSTATUS_NAME as "Status"
            FROM CODBEX_PAYROLLENTRY as PayrollEntry
              INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=PayrollEntry.PAYROLLENTRY_EMPLOYEE
              INNER JOIN CODBEX_PAYROLLSTATUS PayrollStatus ON PayrollStatus.PAYROLLSTATUS_ID=PayrollEntry.PAYROLLENTRY_STATUS
            WHERE PayrollEntry.PAYROLLENTRY_STARTDATE = :StartDate
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `StartDate`,
            type: `VARCHAR`,
            value: filter['StartDate'] !== undefined ?  filter['StartDate'] : `2024-11-01`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: PayrollsSummaryFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT PayrollEntry.PAYROLLENTRY_NETSALARY as "Net salary", PayrollEntry.PAYROLLENTRY_TAXES as "Taxes", PayrollEntry.PAYROLLENTRY_STARTDATE as "Start date", PayrollEntry.PAYROLLENTRY_PAYDATE as "Pay date", Employee.EMPLOYEE_NAME as "Name", PayrollStatus.PAYROLLSTATUS_NAME as "Status"
                FROM CODBEX_PAYROLLENTRY as PayrollEntry
                  INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=PayrollEntry.PAYROLLENTRY_EMPLOYEE
                  INNER JOIN CODBEX_PAYROLLSTATUS PayrollStatus ON PayrollStatus.PAYROLLSTATUS_ID=PayrollEntry.PAYROLLENTRY_STATUS
                WHERE PayrollEntry.PAYROLLENTRY_STARTDATE = :StartDate
            )
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `StartDate`,
            type: `VARCHAR`,
            value: filter.StartDate !== undefined ?  filter.StartDate : `2024-11-01`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}