/**
 * User: Liam Dickson
 * Date: 7/8/15
 * Time: 5:23 PM
 */

'use strict';
var React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var {Alert, Button, PanelGroup, Panel, PageHeader, Well, Input, Modal} = require('react-bootstrap');

var FormGroup = React.createClass({
    displayName: 'FormGroup',
    getInitialState: function () {
        return {
            alertVisible: false
        };
    },
    render: function () {
        var alert = "";
        if (this.state.alertVisible) {
            alert = (
                <Alert bsStyle='success' bsSize='small' onDismiss={()=>{this.setState({alertVisible: false});}} dismissAfter={2000}>
                    <p>Saved {this.props.name}</p>
                </Alert>
            );
        }
        var ruleName = this.props.name;
        var regex = this.props.rule.regex;
        var text = this.props.rule.text;
        var bgColor = this.props.rule.backgroundColor;
        var color = this.props.rule.color;
        return (
            <div className={this.props.className}>
                <Panel header={ruleName.toUpperCase()} bsStyle="primary">
                    <form className="form-horizontal">
                        <Input bsSize="small" labelClassName='col-md-2 col-xs-4' wrapperClassName='col-md-10 col-xs-8' ref='name' type='text' label='Rule Name' defaultValue={ruleName} />
                        <Input bsSize="small" labelClassName='col-md-2 col-xs-4' wrapperClassName='col-md-10 col-xs-8' ref='regex' type='text' label='RegEx' placeholder='RegEx to match (URL)' defaultValue={regex} />
                        <Input bsSize="small" labelClassName='col-md-2 col-xs-4' wrapperClassName='col-md-10 col-xs-8' ref='text' type='text' label='Notification Text' placeholder='Text to be displayed in the notification' defaultValue={text} />
                        <Input bsSize="small" labelClassName='col-md-2 col-xs-4' wrapperClassName='col-md-10 col-xs-8' ref='bgColor' type='text' label='Background Color' placeholder='(e.g. green, blue, #FFF)' defaultValue={bgColor} />
                        <Input bsSize="small" labelClassName='col-md-2 col-xs-4' wrapperClassName='col-md-10 col-xs-8' ref='color' type='text' label='Text Color' placeholder='(e.g. green, blue, #FFF)' defaultValue={color} />
                        {alert}
                        <Button bsSize="small" onClick={()=>{this.props.saveFunc(this.refs, ()=>{this.setState({alertVisible: true});})}} bsStyle='success'>Save</Button>
                        <Button bsSize="small" onClick={this.props.removeFunc} bsStyle='danger' className='pull-right'>Delete Rule</Button>
                    </form>
                </Panel>
            </div>
        );
    }
});

var Form = React.createClass({
    displayName: 'Form',
    addRule: function () {
        var pageRules = this.props.pageRules;
        var ruleName;
        var counter = 1;
        do{
            ruleName = 'NewRule-' + counter++;
        }while(pageRules[ruleName]);
        pageRules[ruleName] = {
            regex: '',
            text: '',
            backgroundColor: '',
            color: ''
        };
        this.syncRules(pageRules);
    },
    showRemoveModal: function (name, e) {
        this.props.setModal({
            body: 'Are you sure you want to delete rule "' + name + '"? This cannot be undone.',
            buttonAction: _.partial(this.removeRule, name),
            buttonText: 'Remove Rule'
        }, e);
    },
    removeRule: function (name) {
        var pageRules = this.props.pageRules;
        delete pageRules[name];
        this.syncRules(pageRules);
    },
    saveRule: function (name, formValues, callback) {
        callback = callback ? callback : null;
        var pageRules = this.props.pageRules;
        pageRules[formValues.name.getValue()] = {
            regex: formValues.regex.getValue(),
            text: formValues.text.getValue(),
            backgroundColor: formValues.bgColor.getValue(),
            color: formValues.color.getValue()
        };
        if(name !== formValues.name.getValue()) {
            delete pageRules[name];
        }
        this.syncRules(pageRules, callback);
    },
    syncRules: function (pageRules, callback) {
        chrome.runtime.sendMessage({method:"notifier-setRules", pageRules: pageRules}, ()=>{
            this.props.loadRules();
            if(callback){
                callback();
            }
        });
    },
    render: function () {
        return (
            <div>
                {_.map(this.props.pageRules, (rule, name)=>{
                    return <FormGroup
                        key={name}
                        rule={rule}
                        name={name}
                        removeFunc={_.partial(this.showRemoveModal, name)}
                        saveFunc={_.partial(this.saveRule, name)}
                    />;
                })}
                <Button onClick={this.addRule} bsStyle='success' bsSize='large' block>Add New Rule</Button>
            </div>
        );
    }
});

var OptionsBody = React.createClass({
    displayName: 'Body',
    getInitialState: function() {
        return {
            rules: null,
            showModal: false,
            modal: {
                header: 'Confirm',
                body: 'Are you sure?',
                buttonAction: null,
                buttonStyle: 'danger',
                buttonText: 'Confirm'
            }
        };
    },
    setModal: function (options, e) {
        options.header = options.header || $(e.target).text() || 'Confirm';
        options.body = options.body || 'Are you sure?';
        options.buttonStyle = options.buttonStyle || 'danger';
        options.buttonText = options.buttonText || 'Confirm';
        options.buttonAction = _.partial(this.closeModal, {buttonAction: options.buttonAction});
        this.setState({
            showModal: true,
            modal: options
        });
    },
    closeModal: function (e) {
        if(e.buttonAction){
            e.buttonAction();
        }
        this.setState({showModal: false});
    },
    showResetModal: function (e) {
        this.setModal({
            body: 'Are you sure you want to reset to default rules? This cannot be undone.',
            buttonAction: this.resetRules,
            buttonText: 'Reset Rules'
        }, e);
    },
    resetRules: function () {
        chrome.runtime.sendMessage({method: "notifier-resetRules"}, ()=>{
            this.loadRules();
        });
    },
    loadRules: function () {
        chrome.storage.sync.get('pageRules', (data)=>{
            this.setState({ rules: (<Form pageRules={data.pageRules} loadRules={this.loadRules} setModal={this.setModal} {...this.props} />) });
        });
    },
    render: function () {
        if(!this.state.rules) {
            this.loadRules();
        }
        return (
            <div className="container">
                <PageHeader>1stdibs.com Notifier Options
                    <Button onClick={this.showResetModal} bsStyle='warning' bsSize='small' className='pull-right reset-button'>Reset Default Rules</Button>
                </PageHeader>
                <Modal show={this.state.showModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>{this.state.modal.header}</Modal.Header>
                    <Modal.Body>
                        <p>{this.state.modal.body}</p>
                        <Button onClick={this.closeModal}>Cancel</Button>
                        <Button onClick={this.state.modal.buttonAction} bsStyle={this.state.modal.buttonStyle} className='pull-right'>{this.state.modal.buttonText}</Button>
                    </Modal.Body>
                </Modal>
                <Well>
                    {this.state.rules ? this.state.rules : <p>Loading Rules...</p>}
                </Well>
            </div>
        );
    }
});

React.render(<OptionsBody />, document.getElementById('body'));
