import Mail from '@mui/icons-material/Mail'
import Link from '@mui/material/Link'
/**
 * 
 * @param {{value:string} & import('@mui/material/Link').LinkProps} props
 * @returns {JSX.Element}
 */
const EmailField = ({ value, color = "primary.main", ...props }) => {
    if (!value) return null;
    return (
        <Link title={value} href={`mailto:${value}`} color={color} {...props} style={{ display: "flex", gap: ".5rem", ...props.style }}>
            <Mail />
            <span>{value}</span>
        </Link>
    )
}
export default EmailField