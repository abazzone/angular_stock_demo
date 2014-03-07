'use strict';


  newsApp.directive('companyName', function() {
    return {
      template: '<span>Company Name: <strong>{{stockCoName}}</strong></span>'
    };
  });