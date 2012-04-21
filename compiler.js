var compile = function (musexpr)
{
	var start = 0;
	var dur_max = 0;

	var processNoteOrRestTag = function(expr)
	{
		var note = { tag: expr.tag, start: start, dur: expr.dur }
		if ( expr.pitch )
			note.pitch = expr.pitch;
		return note;
	};

	var compileSeq = function(expr)
	{
		var notes = [];

		if ( expr.tag === 'repeat' )
		{
			for ( var i = 0; i < expr.count; ++i )
			{
				notes = notes.concat(compileSeq(expr.section));
			}
			return notes;
		}
		else if ( expr.tag === 'seq' )
		{
			return compileSeq(expr.left).concat(compileSeq(expr.right));
		}
		else if ( expr.tag === 'par' )
		{
			dur_max = 0;
			notes =  compilePar(expr.left).concat(compilePar(expr.right));
			start = start + dur_max;
			return notes;
		}
		else
		{
			notes.push(processNoteOrRestTag(expr));
			start = start + expr.dur;
			return notes;
		}
	};

	var compilePar = function(expr)
	{
		if ( expr.tag === 'par' )
		{
			return compilePar(expr.left).concat(compilePar(expr.right));
		}
		else if ( expr.tag === 'note' || expr.tag === 'rest' )
		{
			if ( expr.dur > dur_max )
				dur_max = expr.dur;
			return [processNoteOrRestTag(expr)];
		}
		else
			throw 'Incompatible tag inside "par"';
	}
	return compileSeq(musexpr);
};

/*
var melody_mus = {
	tag: 'repeat',
	section: {
		tag: 'seq',
		left: {
			tag: 'seq',
			left: { tag: 'note', pitch: 'a4', dur: 250 },
			right: {
				tag: 'par',
				left: { tag: 'note', pitch: 'c4', dur: 250 },
				right: {
					tag: 'par',
					left: { tag: 'note', pitch: 'e4', dur: 350 },
					right: { tag: 'note', pitch: 'g4', dur: 250 }
				}
			}
		},
		right: { tag: 'note', pitch: 'b4', dur: 250 }
	},
	count: 3 };
*/

var melody_mus = {
		tag: 'seq',
		left: {
			tag: 'seq',
			left: {
				tag: 'repeat',
				section:  { tag: 'note', pitch: 'a4', dur: 250 },
				count: 3
			},
			right: {
				tag: 'par',
				left: { tag: 'note', pitch: 'c4', dur: 250 },
				right: {
					tag: 'par',
					left: { tag: 'note', pitch: 'e4', dur: 350 },
					right: { tag: 'note', pitch: 'g4', dur: 250 }
				}
			}
		},
		right: { tag: 'rest',  dur: 250 }
	};


console.log(melody_mus);
console.log(compile(melody_mus));
