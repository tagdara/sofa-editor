import React, { Component, createElement  } from 'react';

export const DataContext = React.createContext();

export class DataProvider extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
            colorScheme: '',
        };
    }
    
    setColorScheme = scheme => {
        this.setState({colorScheme: scheme})
    }
    
    render() {
        return (
            <DataContext.Provider value={{ colorScheme: this.state.colorScheme, setColorScheme: this.setColorScheme, }} >
                {this.props.children}
            </DataContext.Provider>
        );
    }
}

export default DataProvider;