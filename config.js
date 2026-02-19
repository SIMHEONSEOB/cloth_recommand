// API 설정 - 보안을 위해 별도 파일로 분리
export const API_CONFIG = {
    GEMINI_API_KEY: 'AIzaSyDXFebL7ejOYelwtp_Md_FMfQQwRm0e1j0'
};

// 환경 변수 우선 사용 (배포 시)
if (typeof process !== 'undefined' && process.env.GEMINI_API_KEY) {
    API_CONFIG.GEMINI_API_KEY = process.env.GEMINI_API_KEY;
}
