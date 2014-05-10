var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Videos
 * =====
 */

var Video = new keystone.List('Video');

Video.add({
	title: { type: String, required: true, initial: true, index: true },
	description: { type: String, initial: true},
	urlUptobox: { type: String, initial: true, required: true },
	dateVideo: { type: Types.Date},
	dateCreation: { type: Types.Date},
	user: { type: Types.Relationship, ref: 'User' , required: true, initial: true},
	tags: { type: Types.Relationship, ref: 'Tag' , required: true, initial: true, many: true}
});

/**
 * Registration
 */

Video.defaultColumns = 'title, urlUptobox, dateCreation, user';
Video.register();