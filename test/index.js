import polymorph from '../index.js';

export function suite(add){

	add("signature complexity is respected", function(){
		var first = this.spy();
		var second = this.spy();

		var fn = polymorph(
			[String],
			first,

			[],
			second
		);

		fn('yo');

		return this.calledWith(first, 'yo');
	});

	add("function called with right bind", function(){
		var first = this.spy();
		var bind = {};

		var fn = polymorph(
			first
		);

		fn.call(bind);

		this.calledOn(first, bind);
	});

	add("arguments length as signature", function(){
		var first = this.spy();
		var second = this.spy();
		var third = this.spy();

		var fn = polymorph(
			function(){ first(); },
			function(a){ second(a); },
			function(a, b){ third(a, b); }
		);

		fn();
		this.calledWith(first, undefined);
		fn('foo');
		this.calledWith(second, 'foo');
		fn('foo', 'bar');
		this.calledWith(third, 'foo', 'bar');
	});

	add("primitives in signature", function(){
		var boolean = this.spy();
		var string = this.spy();
		var number = this.spy();

		var fn = polymorph(
			[Boolean],
			boolean,
			[String],
			string,
			[Number],
			number
		);

		fn(true);
		fn('foo');
		fn(10);

		this.calledWith(boolean, true);
		this.calledWith(string, 'foo');
		this.calledWith(number, 10);
	});

	add("instanceof in signature", function(){
		var first = this.spy();

		var CustomConstructor = function(){};
		var customConstructor = new CustomConstructor();

		var fn = polymorph(
			[CustomConstructor],
			first
		);

		fn(customConstructor);
		this.calledWith(first, customConstructor);
	});

	add("isPrototypeOf in signature", function(){
		var first = this.spy();

		var CustomObject = {};
		var customObject = Object.create(CustomObject);

		var fn = polymorph(
			[CustomObject],
			first
		);

		fn(customObject);
		this.calledWith(first, customObject);
	});

	add("'any' in signature (hole in the array)", function(){
		var first = this.spy();

		var fn = polymorph(
			[,String],
			first
		);

		fn(true, 'bar');
		this.calledWith(first, true, 'bar');
		fn(undefined, 'boo');
		this.calledWith(first, undefined, 'boo');
	});

	add('rest params in signature (schema left part is sufficient to match signature)', function(){
		var first = this.spy();

		var called = false;
		var fn = polymorph(
			[String],
			first
		);

		fn('foo', 'bar');
		this.calledWith(first, 'foo', 'bar');
	});

	add("Error code EMPTY_SIGNATURE", function(){
		var fn = polymorph();
		var spy = this.spy(fn);

		spy();

		this.threwWith(spy, {code: 'EMPTY_SIGNATURE'});
	});

	add("Error code NOT_ENOUGH_ARGUMENT", function(){
		var fn = polymorph(
			function(a){

			}
		);
		var spy = this.spy(fn);
		spy();

		this.threwWith(spy, {code: 'NOT_ENOUGH_ARGUMENT'});
	});

	add("Error code TOO_MUCH_ARGUMENT", function(){
		var fn = polymorph(
			function(){

			}
		);
		var spy = this.spy(fn);
		spy('foo');

		this.threwWith(spy, {code: 'TOO_MUCH_ARGUMENT'});
	});

	add("Error code INVALID_ARGUMENT", function(){
		var fn = polymorph(
			[String],
			function(){

			}
		);
		var spy = this.spy(fn);
		spy(10);

		this.threwWith(spy, {code: 'INVALID_ARGUMENT'});
	});
}