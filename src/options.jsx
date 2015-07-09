/**
 * User: Liam Dickson
 * Date: 7/8/15
 * Time: 5:23 PM
 */

'use strict';
var React = require('react');
var _ = require('underscore');
var {Button, PanelGroup, Panel, PageHeader, Well, Input} = require('react-bootstrap');

var FormGroup = React.createClass({
    displayName: 'FormGroup',
    save: function () {
        this.props.saveFunc(this.refs);
    },
    render: function () {
        var ruleName = this.props.name;
        var regex = this.props.rule.regex || ".*://.*\\.1stdibs\\.com/";
        var text = this.props.rule.text;
        var bgColor = this.props.rule.backgroundColor;
        var color = this.props.rule.color;
        return (
            <PanelGroup accordion defaultActiveKey={this.props.selectedRule}>
                <Panel header={ruleName.toUpperCase()} eventKey={ruleName} bsStyle="primary">
                    <Input ref='name' type='text' label='Rule Name' defaultValue={ruleName} />
                    <Input ref='regex' type='text' label='RegEx' placeholder='Page Url' defaultValue={regex} />
                    <Input ref='text' type='text' label='Text' placeholder='Text to be displayed in the notification.' defaultValue={text} />
                    <Input ref='bgColor' type='text' label='Background Color' placeholder='(e.g. green, blue, #FFF)' defaultValue={bgColor} />
                    <Input ref='color' type='text' label='Color' placeholder='(e.g. green, blue, #FFF)' defaultValue={color} />
                    <Button onClick={this.save} bsStyle='success'>Save</Button>
                    <Button onClick={this.props.removeFunc} bsStyle='danger' className='pull-right'>Delete</Button>
                </Panel>
            </PanelGroup>
        );
    }
});

var Form = React.createClass({
    getInitialState: function() {
        return {
            pageRules: {},
            selectedRule: 0
        };
    },
    displayName: 'Form',
    addRule: function () {
        var pageRules = this.state.pageRules;
        var ruleName;
        var counter = 1;
        do{
            ruleName = 'NewRule-' + counter++;
        }while(pageRules[ruleName]);
        pageRules[ruleName] = {};
        console.log(pageRules);
        this.setState({pageRules, selectedRule: ruleName});
    },
    removeRule: function (name) {
        var pageRules = this.state.pageRules;
        if (confirm('Are you sure you want to delete rule "'+name+'"?') == true) {
            delete pageRules[name];
            this.syncRules();
            this.setState({pageRules, selectedRule: Object.keys(this.state.pageRules)[0]});
        }
    },
    saveRule: function (name, formValues) {
        var pageRules = this.state.pageRules;
        pageRules[formValues.name.getValue()] = {
            regex: formValues.regex.getValue(),
            text: formValues.text.getValue(),
            backgroundColor: formValues.bgColor.getValue(),
            color: formValues.color.getValue()
        };
        if(name !== formValues.name.getValue()) {
            delete pageRules[name];
        }
        this.syncRules({save: true});
        this.setState({pageRules});
    },
    syncRules: function (options) {
        chrome.storage.sync.set({pageRules: this.state.pageRules});
        chrome.runtime.sendMessage({method:"notifier-setRules"}, function (response) {
            if(options.save) {
                alert('Rule Saved');
            }
        });
    },
    componentWillMount: function () {
        var selectedRule = Object.keys(this.props.pageRules)[0];
        this.setState({pageRules: this.props.pageRules, selectedRule});
    },
    render: function () {
        var listNum = 0;
        return (
            <form>
                {_.map(this.state.pageRules, (rule, name)=>{
                    return <FormGroup
                        key={name}
                        rule={rule}
                        name={name}
                        keyNum={listNum++}
                        selectedRule={this.state.selectedRule}
                        removeFunc={_.partial(this.removeRule, name)}
                        saveFunc={_.partial(this.saveRule, name)}
                    />;
                })}
                <Button onClick={this.addRule} bsStyle='success' bsSize='large' block>Add New Rule</Button>
            </form>
        );
    }
});

var OptionsBody = React.createClass({
    displayName: 'Body',
    resetRules: function () {
        if (confirm('Are you sure you want to reset all rules?') == true) {
            chrome.runtime.sendMessage({method: "notifier-resetRules"}, function () {
                location.reload();
            });
        }
    },
    render: function () {
        return (
            <div className="container">
                <PageHeader>1stdibs.com Notifier Options
                    <Button onClick={this.resetRules} bsStyle='warning' bsSize='small' className='pull-right reset-button'>Reset Default Rules</Button>
                </PageHeader>
                <Well>
                    <Form {...this.props} />
                </Well>
            </div>
        )
    }
});

chrome.storage.sync.get('pageRules',function (data) {
    React.render(<OptionsBody pageRules={data.pageRules} />, document.getElementById('body'));
});