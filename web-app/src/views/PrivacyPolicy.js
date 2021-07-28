import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import styles from "assets/jss/material-kit-react/views/staticPages.js";
import Parallax from "components/Parallax/Parallax";
import { language } from 'config';

const dashboardRoutes = [];

const useStyles = makeStyles(styles);

export default function PrivacyPolicy(props) {
  const classes = useStyles();
  const { ...rest } = props;
  return (
    <div>
      <Header
        color="transparent"
        routes={dashboardRoutes}
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 400,
          color: "white"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/header-back.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>

        <div className={classes.container}>
            <br/>
            <h2 className={classes.title}>{language.privacy_policy}</h2>
          <p className={classes.description}>
            Able Apps built the Able app as
            a Free app. This SERVICE is provided by
            Able Apps at no cost and is intended for use as
            is.
          </p> 
          <p className={classes.description}>
            This page is used to inform visitors regarding our
            policies with the collection, use, and disclosure of Personal
            Information if anyone decided to use our Service.
		      </p>
          <p className={classes.description}>
            If you choose to use our Service, then you agree to
            the collection and use of information in relation to this
            policy. The Personal Information that we collect is
            used for providing and improving the Service. We will not use or share your information with
            anyone except as described in this Privacy Policy.
		      </p>
          <p className={classes.description}>
            The terms used in this Privacy Policy have the same meanings
            as in our Terms and Conditions, which is accessible at
            Able unless otherwise defined in this Privacy Policy.
		      </p>
          <p className={classes.description}><strong>Information Collection and Use</strong></p> 
          <p className={classes.description}>
            For a better experience, while using our Service, we will require you to provide us with certain personally identifiable information, including but not limited to <br />
            <ul>
              <li>First Name</li>
              <li>Last Name</li>
              <li>Email Address</li>
              <li>Phone Number</li> 
            </ul>. 
            The information that we request will be retained by us and used as described in this privacy policy.
		      </p>

          <p className={classes.description}>
              We do collect the following sensitive information when you user or Sign up on our App:
		      </p> 
          <p className={classes.description}>
              We collect your location data to enable
		      </p> 
          <p className={classes.description}>
            <ul>
              <li>Search vehicle location</li>
              <li>Travel Route and Navigation</li>
              <li>Realtime vehicle movement</li>
            </ul>
          </p>
          <p className={classes.description}>
              The app does use third party services that may collect
              information used to identify you.
		      </p> 
          <p className={classes.description}>
              Link to privacy policy of third party service providers used
              by the app
		      </p> 
          <p className={classes.description}>
            <ul>
              <li><a href="https://www.facebook.com/about/privacy/update/printable" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul> 
          </p>
          <p className={classes.description}><strong>Log Data</strong></p> 
          <p className={classes.description}>
            We want to inform you that whenever you
            use our Service, in a case of an error in the app
            we collect data and information (through third party
            products) on your phone called Log Data. This Log Data may
            include information such as your device Internet Protocol
            (“IP”) address, device name, operating system version, the
            configuration of the app when utilizing our Service,
            the time and date of your use of the Service, and other
            statistics.
		      </p> 
          <p className={classes.description}><strong>Cookies</strong></p> 
          <p className={classes.description}>
            Cookies are files with a small amount of data that are
            commonly used as anonymous unique identifiers. These are sent
            to your browser from the websites that you visit and are
            stored on your device's internal memory.
		      </p> 
          <p className={classes.description}>
            This Service does not use these “cookies” explicitly. However,
            the app may use third party code and libraries that use
            “cookies” to collect information and improve their services.
            You have the option to either accept or refuse these cookies
            and know when a cookie is being sent to your device. If you
            choose to refuse our cookies, you may not be able to use some
            portions of this Service.
		      </p> 
          <p className={classes.description}><strong>Service Providers</strong></p> 
          <p className={classes.description}>
            We may employ third-party companies and
            individuals due to the following reasons:
		      </p> 
          <p className={classes.description}>
          <ul>
              <li>To facilitate our Service;</li> 
              <li>To provide the Service on our behalf;</li> 
              <li>To perform Service-related services; or</li> 
              <li>To assist us in analyzing how our Service is used.</li>
          </ul> 
          </p>
          <p className={classes.description}>
            We want to inform users of this Service
            that these third parties have access to your Personal
            Information. The reason is to perform the tasks assigned to
            them on our behalf. However, they are obligated not to
            disclose or use the information for any other purpose.
		      </p> 
          <p className={classes.description}><strong>Security</strong></p> 
          <p className={classes.description}>
            We value your trust in providing us your
            Personal Information, thus we are striving to use commercially
            acceptable means of protecting it. But remember that no method
            of transmission over the internet, or method of electronic
            storage is 100% secure and reliable, and we cannot
            guarantee its absolute security.
		      </p> 
          <p className={classes.description}><strong>Links to Other Sites</strong></p> 
          <p className={classes.description}>
            This Service may contain links to other sites. If you click on
            a third-party link, you will be directed to that site. Note
            that these external sites are not operated by us.
            Therefore, we strongly advise you to review the
            Privacy Policy of these websites. We have
            no control over and assume no responsibility for the content,
            privacy policies, or practices of any third-party sites or
            services.
		      </p> 
          <p className={classes.description}><strong>Children’s Privacy</strong></p> 
          <p className={classes.description}>
            These Services do not address anyone under the age of 13.
            We do not knowingly collect personally
            identifiable information from children under 13. In the case
            we discover that a child under 13 has provided
            us with personal information, we immediately
            delete this from our servers. If you are a parent or guardian
            and you are aware that your child has provided us with
            personal information, please contact us so that
            we will be able to do necessary actions.
		      </p> 
          <p className={classes.description}><strong>Changes to This Privacy Policy</strong></p> 
          <p className={classes.description}>
            We may update our Privacy Policy from
            time to time. Thus, you are advised to review this page
            periodically for any changes. We will
            notify you of any changes by posting the new Privacy Policy on
            this page.
		      </p> 
          <p className={classes.description}>This policy is effective as of 2021-01-01</p> 
          <p className={classes.description}><strong>Contact Us</strong></p> 
          <p className={classes.description}>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at admin@ableapps.net</p>
          <br/><br/>
        </div>
        </div>
        <Footer />
      </div>
  );
}
