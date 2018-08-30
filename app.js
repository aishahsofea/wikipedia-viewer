class Loading extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: "loading",
        }
    }
    componentDidMount() {
        const stopper = `${this.state.text}...`
        this.interval = window.setInterval(() => {
            this.state.text == stopper
                ? this.setState({text: "loading"})
                : this.setState((currentState) => {
                    return {
                        text: `${currentState.text}.`
                    }
                })
        }, 300)
    }
    componentWillUnmount() {
        window.clearInterval(this.interval)
    }
    render() {
        return (
            <div>
                <p className = "loader">{this.state.text}</p>
            </div>
        )
    }
}

const Results = props => {
    let link;
    if (props.list) {
        return (
            <ul>
                {props.list.map((obj) => (
                    <li key = {obj.pageid}>
                        <a href={`https://en.wikipedia.org/?curid=${obj.pageid}`} target="_blank">
                            <span><h3>{obj.title}</h3></span>
                            <br/>
                            <span className = "text">{$("<p/>").html(obj.snippet).text()}</span>
                        </a>
                    </li>
                ))}
            </ul>
        )
    }
    return null;
}

class WikiApp extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            input: "",
            searched: "",
            data: null,
            loading: false,
        }
        this.updateInput = this.updateInput.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleStopLoader = this.handleStopLoader.bind(this)
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.searched !== prevState.searched) {
            fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&origin=*&srsearch=${this.state.searched}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    data: data.query.search,
                    loading: false
                })
            })
        }
    }
    handleStopLoader() {
        this.setState({
            loading: false
        })
    }
    updateInput(event) {
        this.setState({
            input: event.target.value
        })
    }
    handleSearch() {
        this.setState({
            searched: this.state.input,
            input: "",
            loading: true,
        })
    }
    render() {

        if (this.state.loading) {
            return (
                <div className = "loader-container">
                    <button className = "back" onClick = {this.handleStopLoader}>Back to home page</button>
                    <Loading/>
                </div>
            )
        }

        return (
            <div className = "center">
                <div className = "random"><a target="_blank" href="https://en.wikipedia.org/wiki/Special:Random" target="_blank">click here for a random article</a></div>
                <div className = "search-box">
                <input
                    type = "text"
                    placeholder = "Search"
                    value = {this.state.input}
                    onChange = {this.updateInput}
                    onKeyPress = {(event) => {
                        if (event.key == "Enter") {
                            this.handleSearch(event)
                        }
                    }}
                />
                <button className = "search-button" onClick = {this.handleSearch} >
                    <i className = "fa fa-search"></i>
                </button>
                </div>
                <Results list = {this.state.data}/>
            </div>
        )
    }
}
ReactDOM.render(
    <WikiApp/>,
    document.getElementById("root")
)






