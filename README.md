# Student Grading System

## Introduction

This system is designed to efficiently manage student grading, homework, and group management in educational institutions. It supports three types of users: **Admin**, **Teacher**, and **Student**, with each having specific functions and privileges based on their roles.

## User Types

### 1. Admin
The Admin has full control over the system, with the ability to add, edit, and delete users, groups, courses, and models.

#### Admin Functions:
- Add a new user and assign a role.
- Delete a user.
- View all users.
- View all students.
- View all teachers.
- View a user by ID.
- Add, delete, and edit courses, model, and groups.
- View homework by modelGroupId.
- View grades by modelGroupId.
- View group details by group ID.

### 2. Teacher
Teachers can manage their groups, add and delete homework, grade students, and modify group model.

#### Teacher Functions:
- View homework by modelGroupId.
- Add new homework.
- Delete homework.
- Add new grades.
- Delete grades.
- Edit grades.
- View courses and their models by course ID.
- View groups and their details by group ID.
- View and edit models by modele ID or course ID.

### 3. Student
Students can view their data, grades, and homework assignments. They can also see the assignments and grades of their group members.

#### Student Functions:
- View their own data and rating.
- View homework by modelGroupId.
- View their grades.
- View homework and grades for their group and their assignments by model.

### 4. General User Functions
These functions are available for all registered users:
- View all courses and models.
- View a model by ID.
- View a model by course ID.
- Change password.
- Change profile picture (picUrl).
- Change name/surname.
- Password recovery via email if forgotten.


## User Permissions

### Admin
- Admin users can manage all data, create, edit, and delete users, courses, modules, and groups. Admin can update any user's data except their email.

### Teacher
- Teachers can view and manage their groups, add homework, grade homework, and change modules for their groups.

### Student
- Students can only view their own data, homework, and grades. They cannot modify any data.

## System Access
- The system has a **SignIn** page for users to log in.
- After logging in, users are redirected to their respective pages based on their role: **Student**, **Teacher**, or **Admin**.
- Registered users can log in using their credentials. 

## Final Thoughts
This system aims to improve the efficiency of managing educational processes, keeping track of student progress, and enhancing the quality of teaching. It ensures a smooth workflow for admins, teachers, and students by providing role-based access to data and functionality.