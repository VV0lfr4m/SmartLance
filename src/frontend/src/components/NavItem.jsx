function NavItem({ href, text, className }) {
    return <a href={href} className={className}>{text}</a>;
}

export default NavItem;