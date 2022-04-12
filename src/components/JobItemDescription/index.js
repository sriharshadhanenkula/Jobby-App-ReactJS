import {Component} from 'react'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {GoLinkExternal} from 'react-icons/go'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import Skills from '../Skills'
import SimilarJobDisplayCard from '../SimilarJobDisplayCard'
import './index.css'

const apiStatusView = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDescription extends Component {
  state = {
    jobItemData: '',
    apiStatus: apiStatusView.initial,
    similarJobsList: [],
    skillsList: [],
    lifeAtCompanyDetails: {},
  }

  componentDidMount() {
    this.getJobDetail()
  }

  getFetchedJobDetails = jobItem => ({
    companyLogoUrl: jobItem.company_logo_url,
    companyWebsiteUrl: jobItem.company_website_url,
    employmentType: jobItem.employment_type,
    id: jobItem.id,
    jobDescription: jobItem.job_description,
    location: jobItem.location,
    packagePerAnnum: jobItem.package_per_annum,
    rating: jobItem.rating,
    title: jobItem.title,
  })

  getLifeAtCompanyDetails = eachDetails => ({
    description: eachDetails.description,
    imageUrl: eachDetails.image_url,
  })

  getJobDetail = async () => {
    this.setState({apiStatus: apiStatusView.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobDetails = this.getFetchedJobDetails(data.job_details)
      const updatedSimilarJobs = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      const skillsDataList = data.job_details.skills
      const updatedSkillsList = skillsDataList.map(eachItem => ({
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))
      const lifeAtCompanyDetails = data.job_details.life_at_company
      const updatedLifeAtCompanyDetails = this.getLifeAtCompanyDetails(
        lifeAtCompanyDetails,
      )

      this.setState({
        jobItemData: updatedJobDetails,
        apiStatus: apiStatusView.success,
        similarJobsList: updatedSimilarJobs,
        skillsList: updatedSkillsList,
        lifeAtCompanyDetails: updatedLifeAtCompanyDetails,
      })
    } else {
      this.setState({apiStatus: apiStatusView.failure})
    }
  }

  renderSuccessView = () => {
    const {
      jobItemData,
      similarJobsList,
      skillsList,
      lifeAtCompanyDetails,
    } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemData

    return (
      <div className="bg-container">
        <Header />
        <div className="job-item-detail-card-container">
          <div className="job-item-full-details-main-container">
            <div className="job-details-logo-name-rating-container">
              <img
                alt="job details company logo"
                className="job-details-logo-container"
                src={companyLogoUrl}
              />

              <div className="job-details-name-rating-container">
                <h1 className="job-details-headings">{title}</h1>
                <p>
                  <span className="rating-star">
                    <AiFillStar className="star-tag" />
                  </span>
                  {rating}
                </p>
              </div>
            </div>
            <div className="job-details-location-type-package-container">
              <div className="job-details-location-type-container">
                <div className="job-details-location-container">
                  <p>
                    <span>
                      <MdLocationOn className="react-icon-location" />
                    </span>
                    {location}
                  </p>
                </div>
                <div className="job-details-type-container">
                  <p>
                    <span>
                      <BsFillBriefcaseFill className="react-icon-type" />
                    </span>
                    {employmentType}
                  </p>
                </div>
              </div>
              <div className="job-package-container">
                <p>{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="horizontal-line" />
            <div className="job-description-container">
              <div className="job-description-heading-container">
                <h1 className="job-description-heading">Description</h1>
                <a
                  href={companyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="job-description-link-container"
                >
                  Visit
                  <span className="jobDescription-external-link">
                    <GoLinkExternal />
                  </span>
                </a>
              </div>
              <p className="job-description-paragraph">{jobDescription}</p>
            </div>
            <div className="job-details-skills-container">
              <h1 className="skills-headings">Skills</h1>
              <ul className="skills-list-container">
                {skillsList.map(eachItem => (
                  <Skills key={eachItem.name} skillsDetails={eachItem} />
                ))}
              </ul>
            </div>
            <div className="life-at-company-container">
              <div className="lifeAtCompany-content-container">
                <h1 className="job-description-lifeAtCompany-heading">
                  Life At Company
                </h1>
                <p className="lifeAt-company-paragraph">
                  {lifeAtCompanyDetails.description}
                </p>
              </div>
              <img
                className="lifeAtCompany-image"
                alt="life at company"
                src={lifeAtCompanyDetails.imageUrl}
              />
            </div>
          </div>
        </div>
        <div className="similar-jobs-section-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-jobs-cards-container">
            {similarJobsList.map(eachJob => (
              <SimilarJobDisplayCard key={eachJob.id} jobDetail={eachJob} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  onClickRetryButton = () => {
    this.renderSuccessView()
  }

  renderFailureView = () => (
    <div className="no-object-found-section">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-paragraph">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onClickRetryButton}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJob = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusView.success:
        return this.renderSuccessView()
      case apiStatusView.failure:
        return this.renderFailureView()
      case apiStatusView.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return <div>{this.renderJob()}</div>
  }
}

export default JobItemDescription
