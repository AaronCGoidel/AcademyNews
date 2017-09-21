module.exports = function(sequelize, DataTypes){
    var Article = sequelize.define('article', {
        author: {
            type: DataTypes.STRING
        },
        id: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING
        },
        blurb: {
            type: DataTypes.TEXT
        },
        content: {
            type: DataTypes.TEXT
        },
        imageURL: {
            type: DataTypes.STRING
        },
        photoCred: {
            type: DataTypes.STRING
        },
        publishDate: {
            type: DataTypes.STRING
        },
        tags: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    });
    return Article;
};
