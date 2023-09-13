# CMS-API
{{ur}}=127.0.0.1:8000/
| EndPoint | Method | Description | Bearer Token | Allowed |
| --- | --- | --- | --- | --- |
| {{url}}api/v1/user/student/ | GET | Get all Students | Needed | professor , admin |
| {{url}}api/v1/user/student/studentGet | POST | Get Student by ID | Needed | professor , admin |
| {{url}}api/v1/user/student/studentDelete | PATCH | Delete Student by ID | Needed | professor , admin |
| {{url}}api/v1/user/student/studentCreate | POST | Creat Student according to User Model | Needed | professor , admin |
| {{url}}api/v1/user/student/studentUpdate | PATCH | Update Student Name | Needed | professor , admin |
| {{url}}api/v1/user/prof | GET | Get All Professors | Needed | admin |
| {{url}}api/v1/user/prof/professorGet | POST | Get Professors By ID | Needed | admin |
| {{url}}api/v1/user/prof/professorCreate | POST | Create Professor according to User Model| Needed | admin |
| {{url}}api/v1/user/prof/professorDelete | PATCH | Delete Professor by ID | Needed | admin |
| {{url}}api/v1/user/prof/professorUpdate| PATCH | Update Professor Name | Needed | admin |
| {{url}}api/v1/courses/create | POST | Create course according to Course Model | Needed | professor |
| {{url}}api/v1/courses/delete | POST | Delete Course | Needed | professor |
| {{url}}api/v1/courses/course/:courseCode | POST | Enrol Student to Course | Needed | professor |
| {{url}}api/v1/courses/course/:courseCode | PATCH | Unennrol Student to Course | Needed | professor |
| {{url}}api/v1/courses/course/:courseCode/register | POST | Student Register to Course | Needed | student |
| {{url}}api/v1/courses/course/:courseCode/register | PATCH | Student Deregister to Course | Needed | student |
| {{url}}api/v1/courses/course/:courseCode/files | POST | Course contents Upload to Local and Firebase | Needed | professor |
| {{url}}api/v1/courses/course/:courseCode/files | PATCH | Delete Course Contents from Local and Firebase | Needed | professor |


