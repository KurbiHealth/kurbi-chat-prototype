// @import jquery.js
// @import lodash.js
// @import backbone.js
// @import geometry.js
// @import vectorizer.js
// @import joint.clean.js
// @import joint.shapes.qad.js
// @import selection.js
// @import factory.js
// @import snippet.js

var app = app || {};

var botname = null;
var displayName = "HealthTron 322"
var appHandler = null;
var serverURL = "http://public.foolhardysoftworks.com:8180";
var bots = [];

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function setupHandlers(){

        $('#botchooser').on('change', function(){
            var index = $(this).val();
            var n = bots[index].name;
            botname = n;
            $("#botname").val(n);
             var json = JSON.parse(bots[index].graph);
             appHandler.graph.fromJSON(json);
        });
        $("#botname").on('blur', function(){
            botname = $(this).val();
            var createNew = true;
            bots.forEach(function(bot){
                console.log(bot.name, botname);
                if(bot.name == botname) createNew = false;
            });

            if(createNew) createNewBot();
        });
        $("#deleteBot").on('click', function(){
            var name = bots[$("#botchooser").val()].name;
            console.log('delete', name );
            $.post(serverURL + "/deleteBot", {name:name}, function(res){
                console.log(res);
                loadBots();

            });
        });
}

function createNewBot(){
    console.log('creating new bot');
    var dataCall = $.get('/data/kurbi.json');
    
        
        dataCall.error(function(err){console.log('error',err);});
        dataCall.fail(function(fail){console.log('fail',fail);});

        dataCall.then(function(json){
            
            appHandler.graph.fromJSON(json);
            
        });
}

function saveChatBot(){
    console.log('saving current bot');
    var botObject = {};
    var graphJSON = appHandler.graph.toJSON();
    botObject.name = botname;
    botObject.graphJSON = JSON.stringify(graphJSON);
    botObject.questionJSON = appHandler.createQuestionJSON(graphJSON,appHandler.graph);
    console.log(botObject.questionJSON);
    console.log(graphJSON);
    $.post(serverURL + "/bot", botObject).then(function(res){
        console.log(res);
        loadBots();
    });
}

function loadBots(){
        var dataCall = $.get(serverURL + '/bot');
        
        dataCall.error(function(err){console.log('error',err);});
        dataCall.fail(function(fail){console.log('fail',fail);});

        dataCall.then(function(res){
            bots = res;
            var selected = 1;
            $('#botchooser').empty();
            $.each(res, function (index, value) {
                if(value.name == botname) {
                    selected = index;
                }
                if(value.name != "Hank")
                $('#botchooser').append($('<option/>', { 
                     value: index,
                     text : value.name, 
                 }));
            }); 
            $('#botchooser').val(selected);
            $('#botname').val(bots[selected].name);
            botname = bots[selected].name;
            var json = JSON.parse(bots[selected].graph);
             appHandler.graph.fromJSON(json);
        });

}

app.AppView = Backbone.View.extend({

    el: '#app',

    events: {
        'click #toolbar .add-question': 'addQuestion',
        'click #toolbar .add-answer': 'addAnswer',
        'click #toolbar .add-icon': 'addIconSelector',
        'click #top-nav .preview-dialog': 'previewDialog',
        'click #toolbar .code-snippet': 'showCodeSnippet',
        'click #top-nav .load-example': 'loadExample',
        'click #toolbar .clear': 'clear'
    },

    initialize: function() {

        this.initializePaper();
        this.initializeSelection();
        //this.initializeHalo();
          this.initializeInlineTextEditor();
        //this.initializeTooltips();

        this.loadExample();
        setupHandlers();
        loadBots();
        this.graph.on('change', debounce(saveChatBot, 1000, false));
        
        appHandler = this;
    },

    initializeTooltips: function() {

        var tooltip = new joint.ui.Tooltip({
            rootTarget: '#paper',
            target: '.element',
            content: _.bind(function(element) {

	        var cellView = this.paper.findView(element);
                var cell = cellView.model;

                var t = '- Double-click to edit text inline.';
                if (cell.get('type') === 'qad.Question') {
                    t += '<br/><br/>- Connect a port with another Question or an Answer.';
                }

	        return  t;
            }, this),
            direction: 'right',
            right: '#paper',
            padding: 20
        });
    },

    createQuestionJSON: function(graphJSON,graph){
        var outJSON = {};
        graphJSON.cells.forEach(function(ele,index){
           if(ele.type == 'qad.Question') {
                var temp = {};
                temp.qcode = ele['id'];
                temp.name = botname;
                temp.version = "0.0.1";
                if(ele['start']) temp.qcode = "welcome";

                temp.message = {};
                temp.responses = {};
                temp.message.body = {};

                temp.message.type = 'text message';
                temp.message.body.displayName = displayName;
                temp.message.body.text = ele['question'];
                temp.message.body.qCode = null;

                temp.responses.type = 'response list text';
                temp.responses.body = [];
                temp.responses.keys = {};
                ele.options.forEach(function(option,index){
                    var oTemp = {};
                    oTemp.message = {};
                    oTemp.message.body = {};
                    oTemp.message.body.displayName = null;
                    oTemp.message.body.text = option.text;
                    oTemp.message.type = "text message";
                    oTemp.text = option.text;
                    temp.responses.body.push(oTemp);
                    temp.responses.keys[option.id] = index;
                });

                outJSON[ele.id] = temp;
                
            }


            if(ele.type == 'qad.Answer') {
                var temp = {};
                temp.qcode = ele['id'];
                temp.name = botname;
                temp.version = "0.0.1";
                temp.message = {};
                temp.message.body = {};

                temp.message.type = 'end message';
                temp.message.body.displayName = displayName;
                temp.message.body.text = ele['answer'];
                temp.message.body.qCode = null;
                temp.message.body.image = serverURL+'/backend/icons/PNG/mawc.png';
                temp.responses = {
                type:'response end',
                    body:{
                        bye:{
                            text: "End Chat Session",
                            id: 'end',
                        },              
                    }
                }
                outJSON[ele.id] = temp;
                
            }


            if(ele.type == 'qad.IconSelector') {
                
                var body = [];
                var letters = 'ABCDEFGHIJKLMNO';

                for(var i = 1; i < 13; i++){
                    var temp = {};
                    
                    temp.url = serverURL+"/backend/icons/PNG/icon-"+i+".png";
                    temp.message = {};
                    temp.message.type = 'image message';
                    temp.message.qCode = null;
                    temp.message.meta = i;
                    temp.message.body = {
                                    image: temp.url,
                                        };
                    temp.id = i;
                    body.push(temp);
                }

                var msg =   {
                        message:{
                            type:'text message', 
                            body:{
                                displayName:displayName, 
                                text:"Our chat is completely anonymous, so let's start by choosing an avatar you'd like to represent you.",
                            }

                        },
                        responses: {
                            type:'response list icons',
                            body:body,
                            keys: {}
                        },
                        qcode: ele['id'],
                        name:botname,
                        version:"0.0.1",

                };

                outJSON[ele.id] = msg;

            }

            

        });

        graphJSON.cells.forEach(function(ele){
            //I want this to run after we've already populated
            //the outJSON 

            if(ele.type == 'link'){
                var portIndex = outJSON[ele.source.id].responses.keys[ele.source.port] || 0;
                var sourceType = graph.getCell(ele.source.id).attributes.type;
                
                if(sourceType == "qad.IconSelector"){

                    outJSON[ele.source.id].responses.body.forEach(function(item){
                        item.message.qCode = ele.target.id;
                    });
                }else outJSON[ele.source.id].responses.body[portIndex].message.qCode = ele.target.id;
                
                //outJSON[ele.source.id].responses.body[portIndex].message.type = cc[graph.getCell(ele.target.id).attributes.type];
                //console.log(ele.target.id, graph.getCell(ele.target.id).attributes.type);
            }
        });
        return(outJSON);
    },

    initializeInlineTextEditor: function() {

        var cellViewUnderEdit;

        var closeEditor = _.bind(function() {

            if (this.textEditor) {
                this.textEditor.remove();
                // Re-enable dragging after inline editing.
                cellViewUnderEdit.options.interactive = true;
                this.textEditor = cellViewUnderEdit = undefined;
            }
        }, this);

        this.paper.on('cell:pointerdblclick', function(cellView, evt) {
            
            //this.createQuestionJSON(this.graph.toJSON());
            //evt.target.parentElement.setAttribute('editable','true');
            var left = evt.target.getBoundingClientRect().left;
            var top = evt.target.getBoundingClientRect().top;
            var charSize = 8; 
            var height = cellView.getBBox().height;
            var width = cellView.getBBox().width;
            
            var path = cellView.model.get('type').split('.')[1].toLowerCase();
            var options = cellView.model.get('options');
            if(evt.target.parentElement.nodeName == 'text') 
                {

                    evt.target.innerHTML = evt.target.innerHTML.replace(/&nbsp;/g,' ');
                    charSize = evt.target.getBoundingClientRect().width / evt.target.innerHTML.length;
                    evt.target.style.visibility = "hidden";
                    this.textEditor = true;



                    if(evt.target.parentElement.className.baseVal == 'option-text'){
                        var targetIndex = 0;
                        cellView.model.get('options').forEach(function(element,index){
                            if(element.text == evt.target.innerHTML) targetIndex = index;
                        });
                        path = 'options/'+targetIndex+'/text';
                    }

                    var textInput = document.createElement('input');
                    textInput.style.fontFamily = evt.target.parentElement.getAttribute("font-family")
                    textInput.style.fontSize = evt.target.parentElement.getAttribute("font-size") +"px";
                    textInput.style.backgroundColor = "transparent";
                    textInput.style.border = "none";
                    textInput.style.position = "absolute";
                    textInput.style.left = left + "px";
                    textInput.style.top = (top + window.scrollY) +  "px";
                    this.currentInput = textInput;
                    textInput.addEventListener("blur", function(){
                        if(textInput.value != evt.target.innerHTML){
                            cellView.model.prop(path,textInput.value)
                            var newWidth = charSize * textInput.value.length*1.4;
                            if(path == 'answer' || path == 'question') cellView.model.resize(newWidth,height);
                        }
                        evt.target.style.visibility = "visible";
                        document.body.removeChild(textInput);
                        this.textEditor = false;
                        delete this.currentInput;
                    });
                    textInput.value = evt.target.innerHTML;
            
            
            document.body.appendChild(textInput);
            textInput.focus();
                }
            
                
            // // Clean up the old text editor if there was one.
            // closeEditor();

            // var vTarget = V(evt.target);
            // var text;
            // var cell = cellView.model;

            // switch (cell.get('type')) {

            // case 'qad.Question':

            //     text = joint.ui.TextEditor.getTextElement(evt.target);
            //     if (vTarget.hasClass('body') || V(text).hasClass('question-text')) {

            //         text = cellView.$('.question-text')[0];
            //         cellView.textEditPath = 'question';

            //     } else if (V(text).hasClass('option-text')) {

            //         cellView.textEditPath = 'options/' + _.findIndex(cell.get('options'), { id: V(text.parentNode).attr('option-id') }) + '/text';
            //         cellView.optionId = V(text.parentNode).attr('option-id');

            //     } else if (vTarget.hasClass('option-rect')) {

            //         text = V(vTarget.node.parentNode).find('.option-text');
            //         cellView.textEditPath = 'options/' + _.findIndex(cell.get('options'), { id: V(vTarget.node.parentNode).attr('option-id') }) + '/text';
            //     }
            //     break;

            // case 'qad.Answer':
            //     text = joint.ui.TextEditor.getTextElement(evt.target);
            //     cellView.textEditPath = 'answer';
            //     break;
            // }

            // if (text) {

            //     this.textEditor = new joint.ui.TextEditor({ text: text });
            //     this.textEditor.render(this.paper.el);

            //     this.textEditor.on('text:change', function(newText) {

            //         var cell = cellViewUnderEdit.model;
            //         // TODO: prop() changes options and so options are re-rendered
            //         // (they are rendered dynamically).
            //         // This means that the `text` SVG element passed to the ui.TextEditor
            //         // no longer exists! An exception is thrown subsequently.
            //         // What do we do here?
            //         cell.prop(cellViewUnderEdit.textEditPath, newText);

            //         // A temporary solution or the right one? We just
            //         // replace the SVG text element of the textEditor options object with the new one
            //         // that was dynamically created as a reaction on the `prop` change.
            //         if (cellViewUnderEdit.optionId) {
            //             this.textEditor.options.text = cellViewUnderEdit.$('.option.option-' + cellViewUnderEdit.optionId + ' .option-text')[0];
            //         }

            //     }, this);

            //     cellViewUnderEdit = cellView;
            //     // Prevent dragging during inline editing.
            //     cellViewUnderEdit.options.interactive = false;
            // }
        }, this);

        $(document.body).on('click', _.bind(function(evt) {
            if(this.currentInput && evt.target != this.currentInput) this.currentInput.blur();
            // var text = joint.ui.TextEditor.getTextElement(evt.target);
            // if (this.textEditor && !text) {

            //     closeEditor();
            // }
        }, this));
    },

    initializeHalo: function() {

        this.paper.on('cell:pointerup', function(cellView, evt) {
            console.log('hello');
            if (cellView.model instanceof joint.dia.Link) return;

            var halo = new joint.ui.Halo({
                graph: this.graph,
                paper: this.paper,
                cellView: cellView,
                useModelGeometry: true,
                type: 'toolbar',
                boxContent: false,
                handles: [
                    {
                        name: 'remove',
                        events: { pointerdown: 'removeElement' }
                    },
                    {
                        name: 'clone',
                        events: { pointerdown: 'startCloning', pointermove: 'doClone', pointerup: 'stopCloning' }
                    },
                    {
                        name: 'unlink',
                        events: { pointerdown: 'unlinkElement' }
                    },
                ]
            });

            halo.on('action:remove:pointerdown', function() {
                this.selection.reset();
            }, this)

            halo.render();

        }, this);
    },

    initializeSelection: function() {

        document.body.addEventListener('keydown', _.bind(function(evt) {

            var code = evt.which || evt.keyCode;
            var canDelete = true;
            if(this.selection.first() && this.selection.first().attributes.start) canDelete = false;
            // Do not remove the element with backspace if we're in inline text editing.
            if ((code === 8 || code === 46) && !this.textEditor && this.selection.first()) {
                if(canDelete){
                 this.selection.first().remove();
                 this.selection.reset();   
                }
                 
                return false;
            }

            if( code === 13 && this.textEditor){
                this.currentInput.blur();
            }

        }, this), false);

        var selection = this.selection = new app.Selection;
        var selectionView = new app.SelectionView({ model: selection, paper: this.paper });

        this.paper.on('cell:pointerup', function(cellView) {

            if (!cellView.model.isLink()) {
                selection.reset([cellView.model]);
            }
        });
        this.paper.on('blank:pointerdown', function() { selection.reset([]) });

        selection.on('add reset', this.onSelectionChange, this);
    },

    initializePaper: function() {

        this.graph = new joint.dia.Graph;

        this.paper = new joint.dia.Paper({
            el: this.$('#paper'),
            model: this.graph,
            width: 800,
            height: 600,
            gridSize: 1,
            snapLinks: { radius: 75 },
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports.
                if (magnetS && magnetS.getAttribute('type') === 'input') return false;
                // Prevent linking from output ports to input ports within one element.
                if (cellViewS === cellViewT) return false;
                // Prevent linking to input ports.
                return true;
                //return (magnetT && magnetT.getAttribute('type') === 'input') || (cellViewS.model.get('type') === 'qad.Question' && cellViewT.model.get('type') === 'qad.Answer');
            },
            validateMagnet: function(cellView, magnet) {
                // Note that this is the default behaviour. Just showing it here for reference.
                // Disable linking interaction for magnets marked as passive (see below `.inPorts circle`).
                return magnet.getAttribute('magnet') !== 'passive';
            },
            defaultLink: new joint.dia.Link({
                router: { name: 'manhattan' },
                connector: { name: 'rounded' },
                attrs: {
                '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z', fill: '#6a6c8a', stroke: '#6a6c8a' },
                    '.connection': {
                        stroke: '#6a6c8a', 'stroke-width': 2
                        //filter: { name: 'dropShadow', args: { dx: 1, dy: 1, blur: 2 } }
                    }
                }
            })
        });
    },

    onSelectionChange: function(collection) {

        var cell = collection.first();
        if (cell) {
            this.status('Selection: ' + cell.get('type'));
        } else {
            this.status('Selection emptied.');
        }
    },

    // Show a message in the statusbar.
    status: function(m) {
        this.$('#statusbar .message').text(m);
    },

    addQuestion: function() {

        var q = app.Factory.createQuestion('Question');
        this.graph.addCell(q);
        this.status('Question added.');
    },

    addAnswer: function() {

        var a = app.Factory.createAnswer('Answer');
        this.graph.addCell(a);
        this.status('Answer added.');
    },

    addIconSelector: function(){
        var a = app.Factory.createIconSelector('Select Icon');
        this.graph.addCell(a);
        this.status('IconSelector added.');  
    },

    previewDialog: function() {

        var cell = this.selection.first();
        var el = qad.renderDialog(app.Factory.createDialogJSON(this.graph, cell));

        $('#preview').empty();
        $('#preview').append($('<div>', { 'class': 'background' }));
        $('#preview').append(el).show();

        $('#preview .background').on('click', function() {

            $('#preview').empty();
        });
    },

    loadExample: function() {


        // var that = this;

        // var dataCall = $.get(serverURL + '/bot');
        
        // dataCall.error(function(err){console.log('error',err);});
        // dataCall.fail(function(fail){console.log('fail',fail);});

        // dataCall.then(function(res){
        //     console.log(res);
        //     var json = JSON.parse(res[1].graph);
        //     that.graph.fromJSON(json);
        // });
    },

    clear: function() {

        this.graph.clear();
    },

    showCodeSnippet: function() {

        var cell = this.selection.first();
        var dialog = app.Factory.createDialogJSON(this.graph, cell);

        var id = _.uniqueId('qad-dialog-');

        var snippet = '';
        snippet += '<div id="' + id + '"></div>';
        snippet += '<link rel="stylesheet" type="text/css" href="http://qad.client.io/css/snippet.css"></script>';
        snippet += '<script type="text/javascript" src="http://qad.client.io/src/snippet.js"></script>';
        snippet += '<script type="text/javascript">';
        snippet += 'document.getElementById("' + id + '").appendChild(qad.renderDialog(' + JSON.stringify(dialog) + '))';
        snippet += '</script>';

        var content = '<textarea>' + snippet + '</textarea>';

        var dialog = new joint.ui.Dialog({
            width: '50%',
            height: 200,
            draggable: true,
            title: 'Copy-paste this snippet to your HTML page.',
            content: content
        });

        dialog.open();
    }
});
