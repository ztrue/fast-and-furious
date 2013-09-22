// titleService from ng-boilerplate
describe('$title', function() {
  var $document = null;
  var $title = null;

  beforeEach(module('title'));

  beforeEach(inject(function(_$document_, _$title_) {
    $document = _$document_;
    $title = _$title_;
  }));

  it('should set a title without a suffix', inject(function() {
    var title = 'new title';
    $title.setTitle(title);
    expect($title.getTitle()).toEqual(title);
  }));

  it('should allow specification of a suffix', inject(function() {
    var suffix = ' :: new suffix';
    $title.setSuffix(suffix);
    expect($title.getSuffix()).toEqual(suffix);
  }));

  it('should set the title, including the suffix', inject(function() {
    var title = 'New Title';
    var suffix = ' :: new suffix';
    $title.setSuffix(suffix);
    $title.setTitle(title);
    expect($title.getTitle()).toEqual(title + suffix);
  }));
});
