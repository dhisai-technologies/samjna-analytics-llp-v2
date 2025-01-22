import { config } from "@/config";
import { db } from "@/db";
import { transporter } from "@/tools";
import { type NursingSession, type StressSession, nursingTests, users } from "@lib/database";
import { eq } from "drizzle-orm";

export async function mailNursingReport(session: NursingSession) {
  const nursingTest = await db.query.nursingTests.findFirst({ where: eq(nursingTests.id, session.nursingTestId) });
  if (!nursingTest) return;
  const user = await db.query.users.findFirst({ where: eq(users.id, nursingTest.userId) });
  if (!user) return;
  const template = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Your report has been generated<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;margin:0 auto;padding:20px 0 48px">
      <tbody>
        <tr style="width:100%">
          <td><img alt="Samjna Analytics LLP" height="42" src="https://samjna.co.in/logo.png" style="display:block;outline:none;border:none;text-decoration:none;border-radius:21px;width:42px;height:42px" width="42" />
            <h1 style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0">Your report has been generated</h1>
            <p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">
						Analytical report has been generated for your session {{SESSION_ID}} and participant {{PARTICIPANT_ID}}. Please click on the link below to view the report.
						</p>
						   <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding:27px 0 27px"
            >
              <tbody>
                <tr>
                  <td>
                    <a
                      href="{{REPORT_URL}}"
                      style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#DC2627;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-align:center;padding:11px 23px 11px 23px"
                      target="_blank"
                      ><span
                        ><!--[if mso
                          ]><i
                            style="mso-font-width:383.33333333333337%;mso-text-raise:16.5"
                            hidden
                            >&#8202;&#8202;&#8202;</i
                          ><!
                        [endif]--></span
                      ><span
                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:8.25px"
                        >View Report</span
                      ><span
                        ><!--[if mso
                          ]><i style="mso-font-width:383.33333333333337%" hidden
                            >&#8202;&#8202;&#8202;&#8203;</i
                          ><!
                        [endif]--></span
                      ></a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" /><a href="https://samjna.co.in" style="color:#b4becc;text-decoration:none;font-size:14px" target="_blank">Samjna Analytics LLP</a>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
	`;
  const html = template
    .replace("{{SESSION_ID}}", session.id)
    .replace("{{PARTICIPANT_ID}}", session.userId)
    .replace("{{REPORT_URL}}", `https://posha.samjna.co.in/${session.nursingTestId}/sessions/${session.id}`);
  const date = new Date(Number.parseInt(session.uid));
  const formattedDate = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  await transporter.sendMail({
    from: config.NODEMAILER_FROM_EMAIL,
    to: user.email,
    subject: `Nursing Report for Session at ${formattedDate}`,
    html,
  });
}

export async function mailStressReport(session: StressSession) {
  const user = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
  if (!user) return;
  const template = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Your report has been generated<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:560px;margin:0 auto;padding:20px 0 48px">
      <tbody>
        <tr style="width:100%">
          <td><img alt="Samjna Analytics LLP" height="42" src="https://samjna.co.in/logo.png" style="display:block;outline:none;border:none;text-decoration:none;border-radius:21px;width:42px;height:42px" width="42" />
            <h1 style="font-size:24px;letter-spacing:-0.5px;line-height:1.3;font-weight:400;color:#484848;padding:17px 0 0">Your report has been generated</h1>
            <p style="font-size:15px;line-height:1.4;margin:0 0 15px;color:#3c4149">
						Analytical report has been generated for your session {{SESSION_ID}} and participant {{PARTICIPANT_ID}}. Please click on the link below to view the report.
						</p>
						   <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding:27px 0 27px"
            >
              <tbody>
                <tr>
                  <td>
                    <a
                      href="{{REPORT_URL}}"
                      style="line-height:100%;text-decoration:none;display:block;max-width:100%;mso-padding-alt:0px;background-color:#DC2627;border-radius:3px;font-weight:600;color:#fff;font-size:15px;text-align:center;padding:11px 23px 11px 23px"
                      target="_blank"
                      ><span
                        ><!--[if mso
                          ]><i
                            style="mso-font-width:383.33333333333337%;mso-text-raise:16.5"
                            hidden
                            >&#8202;&#8202;&#8202;</i
                          ><!
                        [endif]--></span
                      ><span
                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:8.25px"
                        >View Report</span
                      ><span
                        ><!--[if mso
                          ]><i style="mso-font-width:383.33333333333337%" hidden
                            >&#8202;&#8202;&#8202;&#8203;</i
                          ><!
                        [endif]--></span
                      ></a
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#dfe1e4;margin:42px 0 26px" /><a href="https://samjna.co.in" style="color:#b4becc;text-decoration:none;font-size:14px" target="_blank">Samjna Analytics LLP</a>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
	`;
  const html = template
    .replace("{{SESSION_ID}}", session.id)
    .replace("{{PARTICIPANT_ID}}", session.userId)
    .replace("{{REPORT_URL}}", `https://chinta.samjna.co.in/sessions/${session.id}`);
  const date = new Date(Number.parseInt(session.uid));
  const formattedDate = date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  await transporter.sendMail({
    from: config.NODEMAILER_FROM_EMAIL,
    to: user.email,
    subject: `Stress Report for Session at ${formattedDate}`,
    html,
  });
}
