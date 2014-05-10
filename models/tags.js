var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Tags
 * =====
 */

var Tag = new keystone.List('Tag');

Tag.add({
	name: { type: String, required: true, index: true }
});

Tag.relationship({ ref:'Video', path:'Tags'})

/**
 * Registration
 */

Tag.defaultColumns = 'name';
Tag.register();
