describe('range', function() {
  beforeEach(module('faf.range'));

  var range;

  beforeEach(inject(function($filter) {
    range = $filter('range');
  }));

  it('should add a range', inject(function() {
    expect(range([], 0)).toEqual([]);
    expect(range([], 3)).toEqual([0, 1, 2]);
    expect(range([2, 5], 2)).toEqual([2, 5, 0, 1]);
  }));
});
