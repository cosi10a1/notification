import React, { Component } from 'react';
import { NavLink, Route, Link } from 'react-router-dom';
import { Badge, Nav, NavItem, NavLink as RsNavLink } from 'reactstrap';
import classNames from 'classnames';
import nav from './_nav';
import SidebarFooter from './../SidebarFooter';
import SidebarForm from './../SidebarForm';
import SidebarHeader from './../SidebarHeader';
import SidebarMinimizer from './../SidebarMinimizer';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.activeRoute = this.activeRoute.bind(this);
    this.hideMobile = this.hideMobile.bind(this);

    this.state = {
      openDropDown: []
    };
  }

  handleClick(e, url) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');

    let openDropDown = this.state.openDropDown.slice();
    openDropDown.indexOf(url) === -1
      ? openDropDown.push(url)
      : openDropDown.splice(openDropDown.indexOf(url), 1);
    this.setState(openDropDown);

    this.props.onDropDownClicked(url);
  }

  activeRoute(routeName) {
    return this.state.openDropDown.indexOf(e => e === routeName) > -1
      ? 'nav-item nav-dropdown open'
      : 'nav-item nav-dropdown';
  }

  hideMobile() {
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show');
    }
  }

  generateTitleNav(name) {
    return {
      title: true,
      name,
      wrapper: {
        // optional wrapper object
        element: '', // required valid HTML5 element tag
        attributes: {} // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: '' // optional class names space delimited list for title item ex: "text-center"
    };
  }

  generateNode(name, url, icon) {
    return {
      name,
      url,
      icon
    };
  }

  convertToNavList(props) {
    const { user, providers, shops } = props;
    if (user.uid) {
      let items = [];
      if (Object.keys(providers).length > 0) {
        items.push(this.generateTitleNav('Nhà Phân Phối'));
        Object.keys(providers).forEach(provider => {
          let provider_nav = this.generateNode(
            providers[provider].profile.name,
            '/providers/' + provider,
            'icon-puzzle'
          );

          let provider_shops = providers[provider].shops.filter(
            e => Object.keys(shops).indexOf(e) !== -1
          );
          if (provider_shops.length > 0) {
            provider_nav.children = [];
            provider_shops.forEach(shop => {
              provider_nav.children.push(
                this.generateNode(
                  shops[shop].profile.name,
                  '/shops/' + shop,
                  'icon-puzzle'
                )
              );
            });
          }

          items.push(provider_nav);
        });
      }
      return items;
    } else return [];
  }

  render() {
    const props = this.props;

    // badge addon to NavItem
    const badge = badge => {
      if (badge) {
        const classes = classNames(badge.class);
        return (
          <Badge className={classes} color={badge.variant}>
            {badge.text}
          </Badge>
        );
      }
    };

    // simple wrapper for nav-title item
    const wrapper = item => {
      return item.wrapper && item.wrapper.element
        ? React.createElement(
            item.wrapper.element,
            item.wrapper.attributes,
            item.name
          )
        : item.name;
    };

    // nav list section title
    const title = (title, key) => {
      const classes = classNames('nav-title', title.class);
      return (
        <li key={key} className={classes}>
          {wrapper(title)}{' '}
        </li>
      );
    };

    // nav list divider
    const divider = (divider, key) => {
      const classes = classNames('divider', divider.class);
      return <li key={key} className={classes} />;
    };

    // nav label with nav link
    const navLabel = (item, key) => {
      const classes = {
        item: classNames('hidden-cn', item.class),
        link: classNames('nav-label', item.class ? item.class : ''),
        icon: classNames(
          !item.icon ? 'fa fa-circle' : item.icon,
          item.label.variant ? `text-${item.label.variant}` : '',
          item.label.class ? item.label.class : ''
        )
      };
      return navLink(item, key, classes);
    };

    // nav item with nav link
    const navItem = (item, key) => {
      const classes = {
        item: classNames(item.class),
        link: classNames(
          'nav-link',
          item.variant ? `nav-link-${item.variant}` : ''
        ),
        icon: classNames(item.icon)
      };
      return navLink(item, key, classes);
    };

    // nav link
    const navLink = (item, key, classes) => {
      const url = item.url ? item.url : '';
      return (
        <NavItem key={key} className={classes.item}>
          {isExternal(url) ? (
            <RsNavLink href={url} className={classes.link} active>
              <i className={classes.icon} />
              {item.name}
              {badge(item.badge)}
            </RsNavLink>
          ) : (
            <NavLink
              to={url}
              className={classes.link}
              activeClassName="active"
              onClick={this.hideMobile}
            >
              <i className={classes.icon} />
              {item.name}
              {badge(item.badge)}
            </NavLink>
          )}
        </NavItem>
      );
    };

    // nav dropdown
    const navDropdown = (item, key) => {
      return (
        <li key={key} className={this.activeRoute(item.url)}>
          <a
            className="nav-link nav-dropdown-toggle"
            href="#"
            onClick={e => this.handleClick(e, item.url)}
          >
            <i className={item.icon} />
            {item.name}
          </a>
          <ul className="nav-dropdown-items">{navList(item.children)}</ul>
        </li>
      );
    };

    // nav type
    const navType = (item, idx) =>
      item.title
        ? title(item, idx)
        : item.divider
          ? divider(item, idx)
          : item.label
            ? navLabel(item, idx)
            : item.children ? navDropdown(item, idx) : navItem(item, idx);

    // nav list
    const navList = items => {
      return items.map((item, index) => navType(item, index));
    };

    const isExternal = url => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };

    // sidebar-nav root
    return (
      <div className="sidebar">
        <SidebarHeader />
        <SidebarForm />
        <nav className="sidebar-nav">
          <Nav>
            {/* {navList(this.convertToNavList(this.props))} */}
            <NavItem>
              <NavLink to="/shops" className="nav-link">
                {/* <Route path="/shops">
                  <Link to="/shops" className="nav-link"> */}
                Cửa hàng
                {/* </Link> */}
                {/* </Route> */}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/add_employee" className="nav-link">
                {/* <Route path="/add_employee">
                  <Link to="/add_employee" className="nav-link"> */}
                Quản lí nhân viên
                {/* </Link>
                </Route> */}
              </NavLink>
            </NavItem>
          </Nav>
        </nav>
        <SidebarFooter />
        {/* <SidebarMinimizer /> */}
      </div>
    );
  }
}

export default Sidebar;
