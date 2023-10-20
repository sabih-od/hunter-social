class cons {
  static secure = 's';
  // static domain = "testv23.demowebsitelinks.com/hunter_social.com/public/api";
  static domain = 'hunterssocial.com';
  // static domain = 'service.demowebsitelinks.com:3015';
  // static domain = 'testv23.demowebsitelinks.com/hunter_social.com/public';
  // static domain = 'service.demowebsitelinks.com/social-hunter.com/public';
  static default_part = 'api';
}

export const Config = {
  SERVICEURL: `http${cons.secure}://${cons.domain}/${cons.default_part}`,
  URL: `http${cons.secure}://${cons.domain}/`,
  // SERVICEURL: `http://${cons.domain}/${cons.default_part}`,
  // URL: `http://${cons.domain}/`,
};
