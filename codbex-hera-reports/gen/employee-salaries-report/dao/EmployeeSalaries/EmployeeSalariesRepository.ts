import { Query, NamedQueryParameter } from "sdk/db";

export interface EmployeeSalaries {
    readonly 'Net Salary': number;
    readonly 'Taxes': number;
    readonly 'Start date': Date;
    readonly 'Pay Date': Date;
    readonly 'Name': string;
    readonly 'Payroll Status': string;
}

export interface EmployeeSalariesFilter {
    readonly 'startdate?': Date;
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
            SELECT PayrollEntry.PAYROLLENTRY_NETSALARY as "Net Salary", PayrollEntry.PAYROLLENTRY_TAXES as "Taxes", PayrollEntry.PAYROLLENTRY_STARTDATE as "Start date", PayrollEntry.PAYROLLENTRY_PAYDATE as "Pay Date", Employee.EMPLOYEE_NAME as "Name", PayrollStatus.PAYROLLSTATUS_NAME as "Payroll Status"
            FROM CODBEX_PAYROLLENTRY as PayrollEntry
              INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=PayrollEntry.PAYROLLENTRY_EMPLOYEE
              INNER JOIN CODBEX_PAYROLLSTATUS PayrollStatus ON PayrollStatus.PAYROLLSTATUS_ID=PayrollEntry.PAYROLLENTRY_PAYROLLSTATUS
            WHERE PayrollEntry.PAYROLLENTRY_STARTDATE = :startdate
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `startdate`,
            type: `DATE`,
            value: filter['startdate'] !== undefined ?  filter['startdate'] : `2024-11-01`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: EmployeeSalariesFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT PayrollEntry.PAYROLLENTRY_NETSALARY as "Net Salary", PayrollEntry.PAYROLLENTRY_TAXES as "Taxes", PayrollEntry.PAYROLLENTRY_STARTDATE as "Start date", PayrollEntry.PAYROLLENTRY_PAYDATE as "Pay Date", Employee.EMPLOYEE_NAME as "Name", PayrollStatus.PAYROLLSTATUS_NAME as "Payroll Status"
                FROM CODBEX_PAYROLLENTRY as PayrollEntry
                  INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=PayrollEntry.PAYROLLENTRY_EMPLOYEE
                  INNER JOIN CODBEX_PAYROLLSTATUS PayrollStatus ON PayrollStatus.PAYROLLSTATUS_ID=PayrollEntry.PAYROLLENTRY_PAYROLLSTATUS
                WHERE PayrollEntry.PAYROLLENTRY_STARTDATE = :startdate
            )
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `startdate`,
            type: `DATE`,
            value: filter.startdate !== undefined ?  filter.startdate : `2024-11-01`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}