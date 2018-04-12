import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {
    openLoadingProject,
    closeLoadingProject
} from '../reducers/modals';

class LoadButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'renderFileInput',
            'setFileInput',
            'handleChange',
            'handleClick'
        ]);
        this.state = {
            loadingError: false,
            errorMessage: ''
        };
    }
    handleChange (e) {
        // Remove the hash if any (without triggering a hash change event or a reload)
        history.replaceState({}, document.title, '.');
        const reader = new FileReader();
        const thisFileInput = e.target;
        reader.onload = () => this.props.vm.loadProject(reader.result)
            .then(() => {
                this.props.closeLoadingState();
                // Reset the file input after project is loaded
                // This is necessary in case the user wants to reload a project
                thisFileInput.value = null;
            })
            .catch(error => {
                this.setState({loadingError: true, errorMessage: error});
            });
        if (thisFileInput.files) { // Don't attempt to load if no file was selected
            this.props.openLoadingState();
            reader.readAsArrayBuffer(thisFileInput.files[0]);
        }
    }
    handleClick () {
        this.fileInput.click();
    }
    setFileInput (input) {
        this.fileInput = input;
    }
    renderFileInput () {
        return (
            <input
                accept=".sb2,.sb3"
                ref={this.setFileInput}
                style={{display: 'none'}}
                type="file"
                onChange={this.handleChange}
            />
        );
    }
    render () {
        if (this.state.loadingError) throw new Error(`Failed to load project: ${this.state.errorMessage}`);
        return this.props.children(this.renderFileInput, this.handleClick);
    }
}

LoadButton.propTypes = {
    children: PropTypes.func,
    closeLoadingState: PropTypes.func,
    openLoadingState: PropTypes.func,
    vm: PropTypes.shape({
        loadProject: PropTypes.func
    })
};

const mapStateToProps = state => ({
    vm: state.vm
});

const mapDispatchToProps = dispatch => ({
    closeLoadingState: () => dispatch(closeLoadingProject()),
    openLoadingState: () => dispatch(openLoadingProject())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadButton);
