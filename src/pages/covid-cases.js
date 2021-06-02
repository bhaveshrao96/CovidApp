import '../res/public/css/style.css';
import fourBoxs from '../res/public/four-boxs.svg';
import leftArrow from '../res/public/left-arrow.svg';
import rightArrow from '../res/public/right-arrow.svg';
import React, { Component } from 'react';
import moment from 'moment';

class CovidCases extends Component {
    constructor(props) {
        super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
        this.state = { //state is by default an object
            tableHeads: [{
                'Country': 'country', 'TotalConfirmed': 'TotalConfirmed', 'TotalDeaths': 'TotalDeaths', 'Date': 'Date',
            },
            ],
            search: '',
            allCountryCases: [],
            covidData: [],
            covidCount: 0,
            startIndex: 0,
            endIndex: 4,
            selectedCountry: ''
        }
        this.nextClicked = this.nextClicked.bind(this);
        this.previousClicked = this.previousClicked.bind(this);
        this.searchCountry = this.searchCountry.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
    }

    componentDidMount() {
        const apiUrl = 'https://api.covid19api.com/summary';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                console.log('This is your data', data.Countries);
                this.setState({
                    allCountryCases: data.Countries,
                    covidData: data.Countries,
                    covidCount: data.Countries.length,
                })
            });

    }

    renderTableData() {
        var startValue = this.state.startIndex;
        var endValue = this.state.endIndex;
        return this.state.covidData.filter((e) => e.Country.toLowerCase().match(this.state.search)).slice(startValue, endValue).map((covidData) => {
            return (
                <tr>
                    <td>{covidData.Country}</td>
                    <td>{covidData.TotalConfirmed}</td>
                    <td>{covidData.TotalDeaths}</td>
                    <td>{moment(covidData.Date).format('DD/MM/YYYY')}</td>
                </tr>
            )
        })
    }
    renderDropDownOptions() {
        return this.state.allCountryCases.map((covidData) => {
            return (
                <option value={covidData.Countries} >{covidData.Country} </option >
            )
        })
    }
    onDropDownChange(e) {
        console.log('dropdownChanged', e.target.value)
        let ddValue = e.target.value
        if (ddValue == 'allCountries') {
            this.setState({
                covidData: this.state.allCountryCases,
                covidCount: this.state.allCountryCases.length,
                selectedCountry: ddValue

            })
        } else {
            let newData = this.state.allCountryCases.filter((e) => e.Country.toLowerCase().match(ddValue.toLowerCase()));
            this.setState({
                covidData: newData,
                covidCount: newData.length,
                selectedCountry: ddValue

            })
        }


    }


    renderTableHeader() {
        let header = Object.keys(this.state.tableHeads[0])
        return header.map((key, index) => {
            return <th key={index}>{key}</th>
        })
    }
    nextClicked() {
        if (this.state.endIndex < this.state.covidCount) {
            this.setState({
                startIndex: this.state.endIndex,
                endIndex: this.state.covidCount < this.state.endIndex + 4 ? this.state.covidCount : this.state.endIndex + 4
            })
        }

    }
    previousClicked() {
        if (this.state.startIndex != 0) {
            this.setState({
                endIndex: this.state.startIndex,
                startIndex: this.state.startIndex - 4
            })
        }

    }
    searchCountry(event) {
        let newArray = []
        if (this.state.selectedCountry == '') {
            newArray = this.state.allCountryCases;
        } else {
            newArray = this.state.covidData;
        }

        let searchValue = event.target.value.toLowerCase();
        console.log(searchValue);
        this.setState({
            startIndex: 0,
            endIndex: 4
        });
        if (searchValue.length > 0) {


            this.setState({ search: searchValue });

            let searchedArray = newArray.filter((e) => e.Country.toLowerCase().match(searchValue));

            if (searchedArray.length > 0) {
                this.setState({
                    covidData: searchedArray,
                    covidCount: searchedArray.length
                })
            } else {
                this.setState({
                    covidData: newArray,
                    covidCount: newArray.length
                })
            }

        } else {
            this.setState({
                covidData: newArray,
                covidCount: newArray.length
            })
        }
    };


    render() {
        let tableInfo;
        if (this.state.covidCount > 4) {
            tableInfo = <span> {this.state.startIndex + 1} - {this.state.endIndex} </span>;
        } else {
            tableInfo = <span> {this.state.covidCount}  </span>;
        }

        return (
            <div className="row covid-page">
                <div className="col-md-10 covid-wrapper">
                    <div className="table-header">
                        Covid Cases
                    </div>

                    <div className='row filter-row'>
                        <div className="col-md-4  dropdown-wrapper">
                            <label>Select Country</label>
                            <select
                                className="custom-select"
                                // value={this.state.selectedCountry}
                                onChange={(e) => {
                                    this.onDropDownChange(e)
                                }}
                            >
                                <option value='allCountries'>All Countries</option>
                                {this.renderDropDownOptions()}
                            </select>

                        </div>
                        <div className='col-md-8 search-row '>
                            <label>Search</label>
                            <input value={this.state.searchValue} onChange={(e) => { this.searchCountry(e) }} ></input>
                        </div>
                    </div>
                    <div className="res-table" >
                        <table className='covid-cases' cellSpacing="0" cellPadding="0">

                            <tbody>
                                <tr>{this.renderTableHeader()}</tr>
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                    <div className="bottom-section">
                        <img onClick={this.previousClicked} src={leftArrow} alt="" />
                        <div className='table-info'>
                            Showing
                            {tableInfo}
                              of
                             <span>{" " + this.state.covidCount}</span> results
                        </div>
                        <img onClick={this.nextClicked} src={rightArrow} alt="" className="right-arrow" />
                    </div>
                </div>
            </div>
        )
    }
}

export default CovidCases