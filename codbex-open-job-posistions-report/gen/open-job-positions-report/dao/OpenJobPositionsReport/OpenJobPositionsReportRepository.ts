import { Query, NamedQueryParameter } from "sdk/db";

export interface OpenJobPositionsReport {
    readonly 'Job Position Number': string;
    readonly 'Department': string;
    readonly 'Organization': string;
    readonly 'Role': string;
    readonly 'Status': string;
    readonly 'Type': string;
    readonly 'Team': string;
    readonly 'Manager': string;
}

export interface OpenJobPositionsReportFilter {
}

export interface OpenJobPositionsReportPaginatedFilter extends OpenJobPositionsReportFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class OpenJobPositionsReportRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: OpenJobPositionsReportPaginatedFilter): OpenJobPositionsReport[] {
        const sql = `
            SELECT JobPosition.JOBPOSITION_NUMBER as "Job Position Number", Department.DEPARTMENT_NAME as "Department", Organization.ORGANIZATION_NAME as "Organization", JobRole.JOBROLE_NAME as "Role", JobStatus.JOBSTATUS_NAME as "Status", JobType.JOBTYPE_NAME as "Type", Team.TEAM_NAME as "Team", Employee.EMPLOYEE_NAME as "Manager"
            FROM CODBEX_JOBPOSITION as JobPosition
              INNER JOIN CODBEX_JOBASSIGNMENT JobAssignment ON JobAssignment.JOBASSIGNMENT_JOBPOSITION = JobPosition.JOBPOSITION_ID
              INNER JOIN CODBEX_DEPARTMENT Department ON Department.DEPARTMENT_ID = JobAssignment.JOBASSIGNMENT_DEPARTMENT
              INNER JOIN CODBEX_ORGANIZATION Organization ON Organization.ORGANIZATION_ID = JobAssignment.JOBASSIGNMENT_ORGANIZATION
              INNER JOIN CODBEX_JOBROLE JobRole ON JobRole.JOBROLE_ID = JobPosition.JOBPOSITION_JOBROLE
              INNER JOIN CODBEX_JOBSTATUS JobStatus ON JobStatus.JOBSTATUS_ID = JobPosition.JOBPOSITION_JOBSTATUS
              INNER JOIN CODBEX_JOBTYPE JobType ON JobType.JOBTYPE_ID = JobPosition.JOBPOSITION_JOBTYPE
              INNER JOIN CODBEX_TEAM Team ON Team.TEAM_ID = JobPosition.JOBPOSITION_TEAM
              INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=JobAssignment.JOBASSIGNMENT_MANAGER
            WHERE JobStatus.JOBSTATUS_NAME = 'Open'
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: OpenJobPositionsReportFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT JobPosition.JOBPOSITION_NUMBER as "Job Position Number", Department.DEPARTMENT_NAME as "Department", Organization.ORGANIZATION_NAME as "Organization", JobRole.JOBROLE_NAME as "Role", JobStatus.JOBSTATUS_NAME as "Status", JobType.JOBTYPE_NAME as "Type", Team.TEAM_NAME as "Team", Employee.EMPLOYEE_NAME as "Manager"
                FROM CODBEX_JOBPOSITION as JobPosition
                  INNER JOIN CODBEX_JOBASSIGNMENT JobAssignment ON JobAssignment.JOBASSIGNMENT_JOBPOSITION = JobPosition.JOBPOSITION_ID
                  INNER JOIN CODBEX_DEPARTMENT Department ON Department.DEPARTMENT_ID = JobAssignment.JOBASSIGNMENT_DEPARTMENT
                  INNER JOIN CODBEX_ORGANIZATION Organization ON Organization.ORGANIZATION_ID = JobAssignment.JOBASSIGNMENT_ORGANIZATION
                  INNER JOIN CODBEX_JOBROLE JobRole ON JobRole.JOBROLE_ID = JobPosition.JOBPOSITION_JOBROLE
                  INNER JOIN CODBEX_JOBSTATUS JobStatus ON JobStatus.JOBSTATUS_ID = JobPosition.JOBPOSITION_JOBSTATUS
                  INNER JOIN CODBEX_JOBTYPE JobType ON JobType.JOBTYPE_ID = JobPosition.JOBPOSITION_JOBTYPE
                  INNER JOIN CODBEX_TEAM Team ON Team.TEAM_ID = JobPosition.JOBPOSITION_TEAM
                  INNER JOIN CODBEX_EMPLOYEE Employee ON Employee.EMPLOYEE_ID=JobAssignment.JOBASSIGNMENT_MANAGER
                WHERE JobStatus.JOBSTATUS_NAME = 'Open'
            )
        `;

        const parameters: NamedQueryParameter[] = [];

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}