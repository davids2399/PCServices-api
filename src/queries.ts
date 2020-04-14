export class Queries{
    users = 'SELECT * FROM users';
    user = 'SELECT * FROM users';

    companies = 'SELECT * FROM companies';
    company = 'SELECT * FROM companies';

    computers = 'SELECT * FROM computers';
    computer = 'SELECT * FROM computers';

    reports = 'SELECT * FROM reports';
    report = 'SELECT * FROM reports';
    reportsWithFK = 'SELECT reports.id, companies.name AS \'company\', computers.serial_number AS \'serial_number\', CONCAT(users.name, " ", users.lastname) as \'user\', services.name as service, reports.visit_start_time, reports.visit_end_time, reports.description FROM reports LEFT JOIN companies ON reports.company_id = companies.id LEFT JOIN computers ON reports.computer_id = computers.id LEFT JOIN users ON reports.user_id = users.id LEFT JOIN services ON reports.service_id = services.id'

    services = 'SELECT * FROM services';
    service = 'SELECT * FROM services';

    loginUser = "SELECT * FROM users";
    loginCompany = "SELECT * FROM companies";
}

export const usersQuery = new Queries().users;
export const userQuery = new Queries().user;

export const companiesQuery = new Queries().companies;
export const companyQuery = new Queries().company;

export const computersQuery = new Queries().computers;
export const computerQuery = new Queries().computer;

export const reportsQuery = new Queries().reports;
export const reportQuery = new Queries().report;
export const reportsWithFK = new Queries().reportsWithFK;


export const servicesQuery = new Queries().services;
export const serviceQuery = new Queries().service;

export const loginUser = new Queries().loginUser;
export const loginCompany = new Queries().loginCompany;