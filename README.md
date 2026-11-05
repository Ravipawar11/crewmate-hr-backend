# CrewMate HR Backend

Simple REST API built with Node.js, Express, and MySQL.

## 1. Create the database

From this `backend` directory, run:

```bash
mysql -u root -p < database.sql
```

This creates the `crewmate_hr` database and its departments, users, employees, attendance, and leave-request tables.

## 2. Configure and start

```bash
cp .env.example .env
npm install
npm start
```

Set `DB_PASSWORD` in `.env` to your local MySQL password. The API starts on `http://localhost:5000`.

## Main endpoints

- `GET /api/health`
- `GET, POST /api/departments`
- `GET, POST /api/employees`
- `GET, PUT, DELETE /api/employees/:id`
- `GET, POST /api/attendance`
- `GET, POST /api/leaves`
- `PATCH /api/leaves/:id/status`
- `GET /api/dashboard`

Example create-employee body:

```json
{
  "employee_code": "EMP001",
  "first_name": "Asha",
  "last_name": "Patel",
  "email": "asha@example.com",
  "department_id": 2,
  "job_title": "Developer",
  "joining_date": "2026-11-05",
  "salary": 60000
}
```

The sample admin user in the SQL file is for local development only; replace its plain-text password with proper password hashing before deploying.
