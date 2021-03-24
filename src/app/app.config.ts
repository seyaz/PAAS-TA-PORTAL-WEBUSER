export const AppConfig = {
  clientId: 'portalclient',
  clientSecret: 'clientsecret',
  redirectUri: window.location.origin + '/callback',
  logoutredirectUri: window.location.origin + '/login',
  scope: 'openid cloud_controller_service_permissions.read cloud_controller.read cloud_controller.write',
  authUrl: 'https://xxx.xxx.xxx.xxx/oauth/authorize',
  checkUrl: 'https://xxx.xxx.xxx.xxx/check_token',
  accessUrl: 'https://xxx.xxx.xxx.xxx/oauth/token',
  infoUrl: 'https://xxx.xxx.xxx.xxx/userinfo',
  logoutUrl: 'https:/xxx.xxx.xxx.xxx/logout',
  userinfoUrl: '/commonapi/v2/user',
  code: 'code',
  sessionTimeout: 10,
  monitoring : false,         // 모니터링 사용 유무
  quantity : false,           // 사용량 조회 사용 유무
  automaticApproval : true,   // 회원가입 자동승인 사용 유무
  apiversion: 'v3',
  webadminUri: 'http://localhost:8090'
};

