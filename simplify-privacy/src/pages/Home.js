/*global chrome*/
import { H4 } from '../components/ui/typography';
import Button from '@mui/material/Button';
import { stuff, mapReduce } from "../helpers/summarization";
import { naiveRubric, mapReduceRubric } from "../helpers/rate-rubric";
import { db } from '../firebase.config';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import React, { useEffect, useState } from 'react';


function Home({setLoading, setSummary, setError, setScores}) {
  const [currentURL, setURL] = useState(null);

  useEffect(() => {
    (async () => {
      // see the note below on how to choose currentWindow or lastFocusedWindow
      const [tab] = await chrome.tabs.query({active:true, lastFocusedWindow: true});
      console.log(tab.url);
      let text = tab.url
      let index = text.indexOf("//");
      let endIndex = text.indexOf("/", index+2);
      let parsed = text.substring(index+2, endIndex);
      setURL(parsed)
    })();
  }, []);

  async function handleClick () {
    setLoading(true);

    // TODO: Get HTML text and replace 
    let testText = `Terms of Use and Privacy Statement
Welcome to the Netflix in Your Neighbourhood (“Experience”)! This Terms of Use and Privacy Statement document (“Terms”) explains our Terms of Use and Privacy Statement for this Experience.

You must be at least 18 years of age to interact with this Experience. The Experience, its contents, and its services (the “Experience”) are for entertainment purposes only. This Experience is brought to you by Netflix, Inc. For questions about our privacy practices, this Experience, or these Terms, please contact us by email at experience@netflix.com. Please include the name of the Experience if you contact us.

To see our California Consumer Privacy Act (CCPA) Privacy Notice, please scroll down.

Collection and Use of Information
In order to provide you with the Experience, we and/or our Experience Providers may collect certain information and/or content from you, including the following:

Identifiers (such as IP address, identifiers from the devices you use to connect, characteristics about the networks you use when you connect to our Experience)
Internet or other electronic network activity information (such as your interactions with the Experience)
Geolocation data (such as IP address or GPS coordinates)
We and our Experience Providers will use the information and content you provide to administer those Experiences.

[This Experience may permit you to sign up to receive our email newsletter. You can unsubscribe from such emails at any time by clicking on the “unsubscribe” link in the footer, or by following such other instructions as may be provided to unsubscribe.]

When you interact with us, certain information might be collected automatically. Examples of information include: the type of computer operating system, device and software characteristics (such as type and configuration), referral URLs, IP address (which may tell us your general location), statistics on page views or interactions with activities, and browser and standard web server log information. This information is collected using technologies such as cookies, pixel tags, and web beacons. We use this information for the support of internal operations, such as to conduct research and analysis to address the performance of our Experience, and to generate aggregated or de-identified reporting for our use.

This Experience might use cookies to support the performance of our site and to remember choices you have made, such as preferred language. You can modify your browser settings to control whether your computer or other device accepts or declines cookies. If you choose to decline cookies you may not be able to use certain interactive features of this Experience or certain of its Experiences. You can delete cookies from your browser; however, that means that any settings or preferences managed by those cookies will also be deleted and you may need to recreate them. Depending on your mobile device, you may not be able to control tracking technologies through settings. The emails we send might include a web beacon or similar technology that lets us know if you received or opened the email and whether you clicked on any of the links in the email.

This Experience might use Google Analytics, a web analytics service offered by Google. Google Analytics assists us in gathering analytics and statistical data in connection with the Experience. On our behalf Google processes this information to analyze the usage of the Experience, create reports on the Experience activities, and provide other services related to Experience and internet usage for us. If you have any questions or concerns with regard to Google Analytics’ privacy practices, you can review their privacy policy at https://policies.google.com/privacy?hl=en

The Experience might give you the option to share information by email, social or other sharing applications, using the clients and applications on your smart device. Social plugins (including those offered by Facebook, Twitter, Instagram, and Pinterest) allow you to share information on those platforms. Social plugins and social applications are operated by the social network themselves and are subject to their terms of use and privacy policies.

We use reasonable administrative, logical, physical and managerial measures to safeguard your information against loss, theft and unauthorized access, use and modification. We may retain information as required or permitted by applicable laws and regulations, including to fulfill the purposes described in these Terms.

Disclosure of Information
We may disclose your information for certain purposes and to third parties, as described below:

The Netflix family of companies: We might share your information among the Netflix family of companies (http://netflix.com/corporateinfo) as needed for data processing and storage, providing customer support, content development, and for other purposes described in the Use of Information Section of this document.
We might use other companies, agents or contractors ("Experience Providers") to perform services on our behalf or to help us to provide this Experience to you. For example, we may use Experience Providers to provide infrastructure and IT services (like hosting the Experience). We do not authorize Experience Providers to use information except in connection with providing their services, subject to the following safety issues. We and our Experience Providers may disclose and otherwise use information where we or they reasonably believe such disclosure is needed to (a) satisfy any applicable law, regulation, legal process, or governmental request, (b) enforce these Terms, including investigation of potential violations thereof, (c) detect, prevent, or otherwise address illegal or suspected illegal activities, security or technical issues, or (d) protect against harm to the rights, property or safety of Netflix, our content partners, users or the public, as required or permitted by law.
If, in the course of sharing information, we transfer personal information to countries outside your region, we will take steps to ensure that the information is transferred in accordance with these Terms and in accordance with the applicable laws on data protection.

Your Information and Rights
You can request access to your personal information or correct or update out-of-date or inaccurate personal information we hold about you. You can object to processing of your personal information, ask us to restrict processing of your personal information, or request portability of your personal information. If we have collected and processed your personal information with your consent, you can withdraw your consent at any time. Withdrawing your consent will not affect the lawfulness of any processing we conducted prior to your withdrawal, nor will it affect processing of your personal information conducted in reliance on lawful processing grounds other than consent.

To make requests, or if you have any other question regarding our privacy practices, please contact our Data Protection Officer/Privacy Office at experience@netflix.com. We respond to all requests we receive from individuals wishing to exercise their data protection rights in accordance with applicable data protection laws.

You have the right to complain to a data protection authority about our collection and use of your personal information.

Name and Likeness
By interacting with this Experience, you grant the Netflix entity that provides you with access to this Experience (Netflix, Inc. or Netflix International B.V.), its affiliates and respective successors and assigns and anyone authorized by any of them (collectively, “Netflix”), the irrevocable, perpetual, worldwide, non-exclusive right to record, depict, and/or portray you and use, and grant to others the right, but not the obligation, to record, depict, and/or portray you and use, your actual or simulated likeness, name, photograph, voice, actions, etc. in connection with the development, production, distribution, exploitation, advertising, promotion and publicity of this Experience, in all media, now known and later devised, and all languages, formats, versions, and forms related to such Experience without compensation to you or any other individual, unless prohibited by law.

Intended use of the Experience
This Experience and any related content or activities are for your personal and non-commercial use only. During your use of the Experience, we grant you a limited, non-exclusive, non-transferable, license to access the Experience content and activities. Except for the foregoing limited license, no right, title or interest shall be transferred to you. You agree not to use the Experience for public performances. You are responsible for all Internet access charges.

You agree not to archive, download (other than through caching necessary for personal use), reproduce, distribute, modify, display, perform, publish, license, create derivative works from, offer for sale, or use content and information contained on or obtained from or through the Experience without express written permission from Netflix and its licensors. You also agree not to: circumvent, remove, alter, deactivate, degrade or thwart any of the content protections in the Experience; use any robot, spider, scraper or other automated means to access the Experience; decompile, reverse engineer or disassemble any software or other products or processes accessible through the Experience; insert any code or product or manipulate the content of the Experience in any way; or, use any data mining, data gathering or extraction method. In addition, you agree not to upload, post, email or otherwise send or transmit any material designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment associated with the Experience, including any software viruses or any other computer code, files or programs.

NEITHER NETFLIX NOR ITS AFFILIATED ENTITIES, NOR ANY OF ITS AGENCIES, NOR ANY OTHER PARTY INVOLVED IN CREATING, PRODUCING, OR DELIVERING THE EXPERIENCE, IS LIABLE FOR ANY DIRECT, INCIDENTAL, CONSEQUENTIAL, INDIRECT, OR PUNITIVE DAMAGES OR LOSSES ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO, OR USE OF, THE EXPERIENCE, EVEN IF ADVISED IN ADVANCE OF SUCH DAMAGES OR LOSSES, TO THE EXTENT PERMITTED BY APPLICABLE LAW.

Netflix may suspend or terminate your Netflix account or access to this Experience if you fail to comply with these Terms.

The Experience, including all content provided on the Experience, is protected by copyright, trade secret or other intellectual property laws and treaties. Netflix is a registered trademark of Netflix, Inc. If you believe your work has been reproduced or distributed in a way that constitutes a copyright infringement or are aware of any infringing material available through the Experience, please notify us by completing the Copyright Infringement Claims form (https://www.netflix.com/copyrights).

The Experience may contain links to other websites owned and operated by third parties ("Third Party Website(s)"). These links are provided to you as a convenience only and visiting any Third Party Website is at your own risk. Netflix is not responsible for the content on such Third Party Websites and makes no representations or warranties with respect thereto. Your access and use of any such Third Party Websites is subject to their terms of use and privacy policies.

By using, visiting, or browsing the Experience, you accept and agree to these Terms. If you do not accept these Terms and/or any updates to these Terms, please do not use this Experience.

California Consumer Privacy Act (CCPA) Privacy Notice
This Privacy Notice applies to California consumers and supplements the Terms.

Personal Information We Collect
We collect information that identifies, relates to, describes, is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or household (“CCPA personal information”). We have collected categories of CCPA personal information noted in the Collection and Use of Information section of these Terms within the last twelve (12) months.

Use of CCPA personal information
We use categories of CCPA personal information listed above for the purposes noted in the Collection and Use of Information section of these Terms.

Categories of CCPA personal information disclosed for a business purpose
We disclose the categories of CCPA personal information noted in the Collection and Use of Information section of these Terms for business purposes. Specifically, we disclose these categories of information for business purposes to the following categories of third parties: Experience Providers, the Netflix family of companies, an entity engaged in a business transfer, law enforcement, courts, governments and regulatory agencies.

Sources of CCPA personal information
We explain our sources of information in the Collection of and Use Information section of our Terms. (Please see that section for more information that may be of interest to you.)

Your rights under the CCPA
You have the right to request that we disclose: what categories and specific pieces of CCPA personal information have been collected about you; the categories of sources from which CCPA personal information are collected; our business or commercial purpose for collecting, using, or disclosing CCPA personal information; the categories of third parties with whom we share CCPA personal information; the categories of CCPA personal information we have disclosed about you for a business purpose. We do not sell personal information.
You have a right to receive a copy of the specific CCPA personal information we have collected about you.
You have a right to deletion of your CCPA personal information, subject to exceptions under the CCPA.
You have a right not to receive discriminatory treatment for exercising any of your CCPA rights. We will not discriminate against you based on your exercise of any of your CCPA rights.
You can assert these rights only where we receive a verified request from you. For information on how to exercise your rights, please see the Your Information and Rights section of these Terms.

If you are a consumer under the CCPA and wish to contact us through an authorized agent, the authorized agent can submit a request on your behalf at experience@netflix.com along with a statement signed by you certifying that the agent is authorized to act on your behalf. In order to verify the request and your identity, we may ask you to verify your identity. Because we only collect limited information about individuals, we may be unable to verify requests to the standard required by the CCPA.`

    let testSummary = `Data Collection: Personal details (e.g., name, email) and non-personal data (e.g., device info) are collected for services and improvements.
Usage: Data is used for services, transactions, communication, and analytics.
Sharing: Shared only with trusted third parties or for legal compliance.
Security: Measures are in place to protect your information.
Cookies: Used for functionality and personalization; users can manage settings.
Third Parties: Not responsible for external sites linked on the platform.
Your Rights: Access, edit, or delete your data; opt-out of marketing.
Updates: Policy changes take effect when posted; check regularly.
Contact: Reach out for questions or concerns.`;
    let testScores = {
      "Transparency": 4,
      "Data Sharing": 3,
      "Reputability": 5,
      "Past Behavior": 5,
    };

    const docRef = doc(db, "webURL", currentURL);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      testSummary = (docSnap.data().summary);
      testScores = (docSnap.data().scores);
      
    } else {
      // If domain not cached, get new result and store in cache 
      
      const result = await mapReduce(testText);
      // const result = await stuff(testText);
      if (result.status === 200) {
        testSummary = result.summary;
        // testScores = testScores;
        
        console.log(result.summary);
      }
      else {
        setError(true);
        return;
      }

      const ratingResult = await mapReduceRubric(testSummary);  //PRIN change to actual text
      // const ratingResult = await naiveRubric(testText); //change to actual text
      if (ratingResult.status === 200) {
        testScores = JSON.parse(ratingResult.ratings);
        // alert(JSON.stringify(testScores));
        
      }
      else {
        setError(true);
        return;
      }
      
      // Store new URL result
      await setDoc(docRef, {
        summary: testSummary,
        scores: testScores,
      });

      console.log("No such document!");
    }
        
    setSummary(testSummary);
    setScores(testScores);
    setLoading(false)
  }
 
  return (
    <>
      {/* Insert Image here */}
      <H4 className="text-center"> Simplify Privacy Policies with One Click!</H4>
      <Button 
        variant="contained" 
        color="success"
        onClick={handleClick}
      >
        Summarize
      </Button>
    </>
  );
}

export default Home;
