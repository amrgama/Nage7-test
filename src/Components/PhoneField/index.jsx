import Phone from '@mui/icons-material/Phone'
import Link from '@mui/material/Link'
/**
 * 
 * @param {{value:string} & import('@mui/material/Link').LinkProps} props
 * @returns {JSX.Element}
 */
const PhoneField = ({ value, color = "primary.main", ...props }) => {
  if (!value) return null;
  return (
    <Link title={value} href={`tel:${value}`} color={color} {...props} style={{ display: "flex", gap: ".5rem", ...props.style }}>
      <Phone />
      <span>{value}</span>
    </Link>
  )
}
export default PhoneField