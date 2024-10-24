import { Query, NamedQueryParameter } from "sdk/db";

export interface EmployeeContacts {
    readonly 'Name': string;
    readonly 'Birth date': Date;
    readonly 'Personal number': string;
    readonly 'Iban': string;
    readonly 'Email': string;
    readonly 'Phone Number': string;
    readonly 'Country': string;
    readonly 'City': string;
    readonly 'Address': string;
}

export interface EmployeeContactsFilter {
    readonly 'FirstName?': string;
}

export interface EmployeeContactsPaginatedFilter extends EmployeeContactsFilter {
    readonly "$limit"?: number;
    readonly "$offset"?: number;
}

export class EmployeeContactsRepository {

    private readonly datasourceName?: string;

    constructor(datasourceName?: string) {
        this.datasourceName = datasourceName;
    }

    public findAll(filter: EmployeeContactsPaginatedFilter): EmployeeContacts[] {
        const sql = `
            SELECT Employee.EMPLOYEE_NAME as "Name", Employee.EMPLOYEE_BIRTHDATE as "Birth date", Employee.EMPLOYEE_PERSONALNUMBER as "Personal number", Employee.EMPLOYEE_IBAN as "Iban", Contact.CONTACT_EMAIL as "Email", Contact.CONTACT_PHONENUMBER as "Phone Number", Country.COUNTRY_NAME as "Country", City.CITY_NAME as "City", Contact.CONTACT_ADDRESS as "Address"
            FROM CODBEX_EMPLOYEE as Employee
              INNER JOIN CODBEX_CONTACT Contact ON Contact.CONTACT_EMPLOYEE=Employee.EMPLOYEE_ID
              INNER JOIN CODBEX_COUNTRY Country ON Country.COUNTRY_ID=Contact.CONTACT_COUNTRY
              INNER JOIN CODBEX_CITY City ON City.CITY_ID=Contact.CONTACT_CITY
            WHERE Employee.EMPLOYEE_FIRSTNAME = :FirstName
            ${Number.isInteger(filter.$limit) ? ` LIMIT ${filter.$limit}` : ''}
            ${Number.isInteger(filter.$offset) ? ` OFFSET ${filter.$offset}` : ''}
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `FirstName`,
            type: `VARCHAR`,
            value: filter['FirstName'] !== undefined ?  filter['FirstName'] : `Scarlett`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName);
    }

    public count(filter: EmployeeContactsFilter): number {
        const sql = `
            SELECT COUNT(*) as REPORT_COUNT FROM (
                SELECT Employee.EMPLOYEE_NAME as "Name", Employee.EMPLOYEE_BIRTHDATE as "Birth date", Employee.EMPLOYEE_PERSONALNUMBER as "Personal number", Employee.EMPLOYEE_IBAN as "Iban", Contact.CONTACT_EMAIL as "Email", Contact.CONTACT_PHONENUMBER as "Phone Number", Country.COUNTRY_NAME as "Country", City.CITY_NAME as "City", Contact.CONTACT_ADDRESS as "Address"
                FROM CODBEX_EMPLOYEE as Employee
                  INNER JOIN CODBEX_CONTACT Contact ON Contact.CONTACT_EMPLOYEE=Employee.EMPLOYEE_ID
                  INNER JOIN CODBEX_COUNTRY Country ON Country.COUNTRY_ID=Contact.CONTACT_COUNTRY
                  INNER JOIN CODBEX_CITY City ON City.CITY_ID=Contact.CONTACT_CITY
                WHERE Employee.EMPLOYEE_FIRSTNAME = :FirstName
            )
        `;

        const parameters: NamedQueryParameter[] = [];
        parameters.push({
            name: `FirstName`,
            type: `VARCHAR`,
            value: filter.FirstName !== undefined ?  filter.FirstName : `Scarlett`
        });

        return Query.executeNamed(sql, parameters, this.datasourceName)[0].REPORT_COUNT;
    }

}