const API_V = "v1";
export const ROUTER = {
    UPLOAD:{
        UPLOAD_FILE: `/api/${API_V}/upload/files`,
    },
    AUTH: {
        LOGIN: `/api/${API_V}/auth/login`,
        VERIFY_OTP_LOGIN: `/api/${API_V}/auth/verify-otp-login`,
        VERIFY_OTP_Forgot_Password: `/api/${API_V}/auth/verify-otp-forgot-password`,
        CHANGE_PASSWORD: (userId: string) => `/api/${API_V}/users/${userId}/change-password`,
        CREATE_PASSWORD: `/api/${API_V}/auth/forgot-password`,
        TWO_FA: `/api/${API_V}/users/2fa`,
        USER_DETAIL: (userId: string) => `/api/${API_V}/users/${userId}/detail`,
        USER_UPDATE: (userId: string) => `/api/${API_V}/users/${userId}/update`,
        SETTINGS: `api/${API_V}/settings/public`,
    },
    POST:{
        CREATE_POST:`/api/${API_V}/kaizen/create-post`,
        EDIT_POST: (id: number) => `/api/${API_V}/kaizen/${id}/update-post`,
        DETAIL_POST: (id: number) => `/api/${API_V}/kaizen/${id}/detail-post`,
        REMOVE_POST: (postId: number) => `api/${API_V}/kaizen/${postId}/remove-post`,
        REACTIONS_POST: `/api/${API_V}/kaizen/reactions/posts`,
        NEWS_FEED: `/api/${API_V}/kaizen/news-feed`
    },
    COMMENT:{
        DETAIL_COMMENT: `/api/${API_V}/kaizen/comments`,
        CREATE_COMMENT:`/api/${API_V}/kaizen/create-comment`,
        UPDATE_COMMENT:`/api/${API_V}/kaizen/update-comment`,
        REMOVE_COMMENT: `/api/${API_V}/kaizen/remove-comment`,

    },
    ATTENDANCE:{
        ATTENDANCE_DETAIL: `/api/${API_V}/attendance-records/detail`,
        ATTENDANCE_RECORDS: `/api/${API_V}/attendance-records`,
        ATTENDANCE_CHECK_IN: `/api/${API_V}/attendance-records/check-in`,
        ATTENDANCE_CHECK_OUT: `/api/${API_V}/attendance-records/check-out`,
    },
   



}