import Jasmine from 'jasmine';

let jasmine = new Jasmine();
jasmine.loadConfigFile('./spec/jasmine.json');
jasmine.execute();