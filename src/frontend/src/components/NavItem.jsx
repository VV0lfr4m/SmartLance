import { HashLink } from 'react-router-hash-link';


function NavItem({ href, text, className }) {
    return (
        <HashLink smooth to={href} className={className}>
            {text}
        </HashLink>
    );
}

export default NavItem;