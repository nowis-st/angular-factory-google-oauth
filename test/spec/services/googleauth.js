'use strict';

describe('Service: googleAuth', function () {

  // load the service's module
  beforeEach(module('erpApp'));

  // instantiate service
  var googleAuth;
  beforeEach(inject(function (_googleAuth_) {
    googleAuth = _googleAuth_;
  }));

  it('should do something', function () {
    expect(!!googleAuth).toBe(true);
  });

});
