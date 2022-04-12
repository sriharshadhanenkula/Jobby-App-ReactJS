import './index.css'

const Skills = props => {
  const {skillsDetails} = props

  return (
    <li className="skill-items-container">
      <img
        className="skill-image"
        alt={skillsDetails.name}
        src={skillsDetails.imageUrl}
      />
      <p className="skill-name">{skillsDetails.name}</p>
    </li>
  )
}

export default Skills
