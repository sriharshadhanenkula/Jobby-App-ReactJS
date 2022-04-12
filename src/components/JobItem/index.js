import {Component} from 'react'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

class JobItem extends Component {
  render() {
    const {jobItem} = this.props
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItem
    return (
      <Link to={`/jobs/${id}`} className="my_link">
        <li className="jobItem-main-container">
          <div className="jobItem-jobHeading-container">
            <div>
              <img
                className="jobItem-jobImage"
                src={companyLogoUrl}
                alt="company logo"
              />
            </div>
            <div>
              <h1 className="jobItem-jobTitle">{title}</h1>
              <p className="jobItem-rating-container">
                <span>
                  <AiFillStar className="jobItem-rating-image" />
                </span>
                {rating}
              </p>
            </div>
          </div>
          <div className="jobItem-location-type-container">
            <div className="jobItem-location-type">
              <div className="jobItem-location-container">
                <p className="jobItem-location">
                  <span>
                    <MdLocationOn className="jobItem-location-image" />
                  </span>
                  {location}
                </p>
              </div>
              <div className="jobItem-location-container">
                <p className="jobItem-location">
                  <span>
                    <BsFillBriefcaseFill className="jobItem-location-image" />
                  </span>
                  {employmentType}
                </p>
              </div>
            </div>
            <div>
              <p className="jobItem-jobPackage">{packagePerAnnum}</p>
            </div>
          </div>
          <hr />
          <div className="jobItem-description-container">
            <h1 className="jobItem-description-heading">Description</h1>
            <p className="jobItem-description-paragraph">{jobDescription}</p>
          </div>
        </li>
      </Link>
    )
  }
}

export default JobItem
