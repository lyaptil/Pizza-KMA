var basil =	require('basil.js');
basil =	new	basil();

exports.set = function(key, value)	{
    return basil.set(key, value);
};
exports.get = function(key)	{
    return basil.get(key);
};