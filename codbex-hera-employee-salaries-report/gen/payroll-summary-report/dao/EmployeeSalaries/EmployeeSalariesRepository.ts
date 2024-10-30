import { Query, NamedQueryParameter } from "sdk/db";

export interface EmployeeSalaries {
    readonly 'Name': string;
    readonly 'Net Salary': number;
    readonly 'Taxes': number;
    readonly 'Start Date': Date;
    readonly 'Pay Date': Date;
    readonly 'Payroll Status': string;
}

export interface EmployeeSalariesFilter {
    readonly 'StartDate?': Date;
}

export interface EmployeeSalariesPaginatedFilter extends EmployeeSalariesFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class EmployeeSalariesRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: EmployeeSalariesPaginatedFilter): EmployeeSalaries[] {
        const sql = `
            SELECT Employee.EMPLOYEE_NAME as "Name", PayrollEntry.PAYROLLENTRY_NETSALARY as "Net Salary", PayrollEntry.PAYROLLENTRY_TAXES as "Taxes", PayrollEntry.PAYROLLENTRY_STARTDATE as "Start Date", PayrollEntry.PAYROLLENTRY_PAYDATE as "Pay Date", PayrollStatus.PAYROLLSTATUS_NAME as "Payroll Status"
            FROM CODBEX_PAYROLLENTRY as PayrollEntry
              INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=PayrollEntry.PAYROLLENTRY_EMPLOYEE
              INNER JOIN CODBEX_PAYROLLSTATUS PayrollStatus ON PayrollStatus.PAYROLLSTATUS_ID=PayrollEntry.PAYROLLENTRY_PAYROLLSTATUS
            WHERE PayrollEntry.PAYROLLENTRY_STARTDATE = :StartDate
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `StartDate`,
            type: `DATE`,
            value: filter['StartDate'] !== undefined ?  filter['StartDate'] : `2024-11-01`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: EmployeeSalariesFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT Employee.EMPLOYEE_NAME as "Name", PayrollEntry.PAYROLLENTRY_NETSALARY as "Net Salary", PayrollEntry.PAYROLLENTRY_TAXES as "Taxes", PayrollEntry.PAYROLLENTRY_STARTDATE as "Start Date", PayrollEntry.PAYROLLENTRY_PAYDATE as "Pay Date", PayrollStatus.PAYROLLSTATUS_NAME as "Payroll Status"
                FROM CODBEX_PAYROLLENTRY as PayrollEntry
                  INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=PayrollEntry.PAYROLLENTRY_EMPLOYEE
                  INNER JOIN CODBEX_PAYROLLSTATUS PayrollStatus ON PayrollStatus.PAYROLLSTATUS_ID=PayrollEntry.PAYROLLENTRY_PAYROLLSTATUS
                WHERE PayrollEntry.PAYROLLENTRY_STARTDATE = :StartDate
            )
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `StartDate`,
            type: `DATE`,
            value: filter.StartDate !== undefined ?  filter.StartDate : `2024-11-01`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}