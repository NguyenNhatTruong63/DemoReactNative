export interface bodyUpdate {
    name:string,
    username: string,
    birthday: string,
    joining_date: string,
    gender: Number,
    avatar: string,
    phone:string,
    address: string,
    id_card_number: string  ,
    email: string,
    // department_name: departmentName,
    department_id: Number,
    manager_id: Number,
    privilege_group_id: Number,
    salary_level_id: Number,
    // salary_level_id: Number(),
}
export interface userLogin{
    username: string,
    password: string,
}
export interface verifyOtpForgotPassword{
    otp: string,
    username: string,
}
export interface verifyOtpPassword{
    otp: string,
    username: string,
}