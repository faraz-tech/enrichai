const express    = require('express');
const app        = express();            
const bodyParser = require('body-parser');
const cors       = require('cors');
const logger     = require('morgan');
const adapter    = require('./adapter/index');

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 2000;

var router = express.Router(); 

router.post('/', async function(req, res) {

    const decoder = await adapter(req);
    
    if(!decoder) {
        return res.status(404).send({
            status: 404,
            error: 'Not found'
        })
    }

    res.json(decoder); 
});

app.use('/adapter', router);

app.listen(port);
console.log('Magic happens on port ' + port);