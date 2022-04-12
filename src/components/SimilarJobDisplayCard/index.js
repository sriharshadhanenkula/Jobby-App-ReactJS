import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetail} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetail

  return (
    <li className="job-details-item-card">
      <div className="similar-job-heading-container">
        <img
          className="similar-job-image"
          alt="similar job company logo"
          src={companyLogoUrl}
        />

        <div className="similar-job-rating-container">
          <h1 className="similar-job-heading">{title}</h1>
          <p className="similar-job-paragraph">
            <span className="rating-star">
              <AiFillStar className="star-tag" />
            </span>
            {rating}
          </p>
        </div>
      </div>
      <div className="similar-job-description-container">
        <h1 className="similar-job-description-heading">Description</h1>
        <p className="similar-job-description-paragraph">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJobCard
