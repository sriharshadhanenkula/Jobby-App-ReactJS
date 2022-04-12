import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class AllJobs extends Component {
  state = {
    profileDetails: {},
    searchInput: '',
    activeSalaryRange: '',
    activeTypeOfEmployment: [],
    jobDetailsList: [],
    apiStatus: apiStatusConstants.initial,
    isLoading: true,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getAllJobDetails()
  }

  getUpdatedProfileDetails = details => ({
    name: details.name,
    profileImageUrl: details.profile_image_url,
    shortBio: details.short_bio,
  })

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    const updatedData = this.getUpdatedProfileDetails(data.profile_details)
    this.setState({profileDetails: updatedData, isLoading: false})
  }

  getAllJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {searchInput, activeSalaryRange, activeTypeOfEmployment} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const activeEmploymentIdStr = activeTypeOfEmployment.join(',')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentIdStr}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobDetailsList = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobDetailsList: updatedJobDetailsList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeEmploymentType = event => {
    const {activeTypeOfEmployment} = this.state
    const findElement = activeTypeOfEmployment.find(
      eachItem => eachItem === event.target.value,
    )
    if (findElement === undefined) {
      this.setState(
        prevState => ({
          activeTypeOfEmployment: [
            ...prevState.activeTypeOfEmployment,
            event.target.value,
          ],
        }),
        this.getAllJobDetails,
      )
    } else {
      const index = activeTypeOfEmployment.findIndex(
        eachItem => eachItem === event.target.value,
      )
      activeTypeOfEmployment.splice(index, 1)
      this.setState(
        {activeTypeOfEmployment: [...activeTypeOfEmployment]},
        this.getAllJobDetails,
      )
    }
  }

  getTypeOfEmploymentItem = (employmentTypeId, label) => (
    <li className="allJob-profile-list-item">
      <input
        type="checkbox"
        id={employmentTypeId}
        value={employmentTypeId}
        onChange={this.onChangeEmploymentType}
      />
      <label className="allJob-profile-label" htmlFor={employmentTypeId}>
        {label}
      </label>
    </li>
  )

  onChangeSalaryRange = event => {
    this.setState(
      {activeSalaryRange: event.target.value},
      this.getAllJobDetails,
    )
  }

  getSalaryRangeItem = (salaryRangeId, label) => (
    <li className="allJob-profile-list-item">
      <input
        type="radio"
        id={salaryRangeId}
        name="salary"
        value={salaryRangeId}
        onChange={this.onChangeSalaryRange}
      />
      <label className="allJob-profile-label" htmlFor={salaryRangeId}>
        {label}
      </label>
    </li>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = event => {
    event.preventDefault()
    this.getAllJobDetails()
  }

  getAllJobsAndSearchDetails = () => {
    const {jobDetailsList} = this.state
    return (
      <div>
        <ul className="allJobs-profile-list">
          {jobDetailsList.map(jobItem => (
            <JobItem key={jobItem.id} jobItem={jobItem} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryButton = () => {
    this.getAllJobDetails()
  }

  getFailureView = () => (
    <div className="no-object-found-section">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="Home-findJob-Button"
        type="button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  getNoJobsDetails = () => (
    <div className="no-object-found-section">
      <img
        alt="no jobs"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p className="failure-paragraph">
        We could not find any jobs. Try other Filters
      </p>
    </div>
  )

  getSuccessView = () => {
    const {jobDetailsList} = this.state
    console.log(jobDetailsList.length)
    if (jobDetailsList.length > 0) {
      return this.getAllJobsAndSearchDetails()
    }
    return this.getNoJobsDetails()
  }

  renderJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSuccessView()
      case apiStatusConstants.failure:
        return this.getFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderProfileAndJobsDetails = () => {
    const {profileDetails, searchInput, isLoading} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="allJobs-container">
        <div className="all-jobs-profile-container">
          {isLoading ? (
            this.renderLoader()
          ) : (
            <div className="allJob-profile-data-container">
              <img src={profileImageUrl} alt="profile" />
              <h1 className="allJob-profile-username">{name}</h1>
              <p className="allJob-profile-user-description">{shortBio}</p>
            </div>
          )}

          <hr />
          <div>
            <h1 className="allJobs-profile-heading">Type of Employment</h1>
            <ul className="allJobs-profile-list">
              {employmentTypesList.map(eachItem =>
                this.getTypeOfEmploymentItem(
                  eachItem.employmentTypeId,
                  eachItem.label,
                ),
              )}
            </ul>
          </div>
          <hr />
          <div>
            <h1 className="allJobs-profile-heading">Salary Range</h1>
            <ul className="allJobs-profile-list">
              {salaryRangesList.map(eachItem =>
                this.getSalaryRangeItem(eachItem.salaryRangeId, eachItem.label),
              )}
            </ul>
          </div>
        </div>
        <div className="allJobs-jobsAndSearch-container">
          <form
            className="jobList-form-container"
            onSubmit={this.onClickSearchButton}
          >
            <input
              type="search"
              placeholder="Search"
              onChange={this.onChangeSearchInput}
              className="jobList-searchInput"
              value={searchInput}
            />
            <button
              className="jobList-search-button"
              type="submit"
              testid="searchButton"
            >
              <BsSearch className="search-icon" />
            </button>
          </form>
          {this.renderJobs()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="allJobs-main-container">
        <Header />
        {this.renderProfileAndJobsDetails()}
      </div>
    )
  }
}

export default AllJobs
