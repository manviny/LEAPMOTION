'use strict';

describe('Service: leapjs', function () {

  // load the service's module
  beforeEach(module('angLeapApp'));

  // instantiate service
  var leapjs;
  beforeEach(inject(function (_leapjs_) {
    leapjs = _leapjs_;
  }));

  it('should do something', function () {
    expect(!!leapjs).toBe(true);
  });

});
