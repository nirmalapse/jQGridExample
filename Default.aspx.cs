using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Configuration;
using System.Data;
using System.Web.Script.Serialization;
using System.Web.Services;
using System.Collections;
using System.DirectoryServices;

namespace jQGridExample
{
    public partial class Default : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            //try
            //{

            // object obj = entry.NativeObject;
            //Logon failure: unknown user name or bad password.
            if (Session["UserName"] == null)
            {
                Response.Redirect("Login.aspx", true);
            }
            else
            {
                lblUserName.Text = "  Welcome " + Session["UserName"].ToString();
                Page.ClientScript.RegisterStartupScript(this.GetType(), "Sample", "alert();", true);
                ScriptManager.RegisterStartupScript(this.Page, this.GetType(), "Sample", "alert('1');", true);


            }


        }

        [WebMethod]
        public static IEnumerable GetDataFromDB()
        {
            try
            {
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("QC_GetMSADailyTracker_Test", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pUserName", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        con.Open();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(dt);
                        con.Close();
                        var TrackingInfo = dt.AsEnumerable().Select(r => new
                    {
                        TrackerNo = r[0].ToString(),
                        Date = r[1].ToString(),
                        UserName = r.Field<string>("User_Name"),
                        //Application = r[3].ToString(),
                        ServiceNowCategory = r[3].ToString(),
                        ServiceNowNumber = r[4].ToString(),
                        //ActivityType = r[6].ToString(),
                        //SubActivity = r[7].ToString(),
                        //StartTime = r[8].ToString(),
                        //EndTime = r[9].ToString(),
                        ActualTime = r[5].ToString(),
                        Comments = r[6].ToString(),
                        UpdatedDate = r[7].ToString(),
                        Seconds = r[8].ToString()


                    });
                        return TrackingInfo;


                    }
                }
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod]
        public static IEnumerable GetRRDataFromDB()
        {
            try
            {
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("QC_GetRRTracker", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pUserName", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        con.Open();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(dt);
                        con.Close();
                        var TrackingInfo = dt.AsEnumerable().Select(r => new
                    {
                        ResponseRecoveryID = r[0].ToString(),
                        TaskNo = r[1].ToString(),
                        Application = r[2].ToString(),
                        AssignmentDate = r[3].ToString(),
                        ResponseTime = r[4].ToString(),
                        RecoveryTime = r[5].ToString(),
                        IsKeDB = r[6].ToString(),
                        KedbLocation = r[7].ToString(),
                        ResponseHrs = r[8].ToString(),
                        RecoveryHrs = r[9].ToString(),
                        ResponseSec = r[10].ToString(),
                        RecoverySec = r[11].ToString(),

                    });
                        return TrackingInfo;


                    }
                }
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod]
        public static IEnumerable GetActivitySubActivity(int ActivityTypeID)
        {
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("QC_GetActivitySubActivities", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@pActivityTypeID", SqlDbType.VarChar).Value = ActivityTypeID;
                    con.Open();

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);

                    var activitySubActivity = dt.AsEnumerable().Select(r => new
                  {
                      SubActivityID = r[0].ToString(),
                      SubActivity = r[1].ToString()
                  });

                    return activitySubActivity;
                }
            }
        }

        [WebMethod]
        public static IEnumerable GetActivityType()
        {
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("QC_GetActivityType", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    // cmd.Parameters.Add("@ClientID", SqlDbType.VarChar).Value = cID;
                    con.Open();

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);

                    var activityType = dt.AsEnumerable().Select(r => new
                    {
                        ActivityTypeID = r[0].ToString(),
                        ActivityType = r[1].ToString()
                    });

                    return activityType;
                }
            }
        }

        [WebMethod]
        public static IEnumerable GetApplications()
        {
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MSA_GetApplications", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);

                    var applications = dt.AsEnumerable().Select(r => new
                  {
                      ApplicationID = r[0].ToString(),
                      Application = r[1].ToString()
                  });

                    return applications;
                }
            }
        }

        [WebMethod]
        public static IEnumerable GetServiceNowCategory()
        {
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("MSA_GetServiceNowCategory", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);

                    var serviceNowCategory = dt.AsEnumerable().Select(r => new
                 {
                     ServiceNowCategoryID = r[0].ToString(),
                     ServiceNowCategory = r[1].ToString()
                 });

                    return serviceNowCategory;
                }
            }
        }

        [WebMethod]
        public static string SaveDailyTracker(string Date, string Application, string ServiceNowCategory, string ServiceNowNumber, string Activity, string SubActivity,
            string StartTime, string EndTime, string TimeSpent, string Comments)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    // using (SqlCommand cmd = new SqlCommand("QC_SaveMSADailyTracker", con))
                    using (SqlCommand cmd = new SqlCommand("QC_SaveMSADailyTracker_Test", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pDate", SqlDbType.Date).Value = Date;
                        cmd.Parameters.Add("@pUserName", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        cmd.Parameters.Add("@pApplicationID", SqlDbType.VarChar).Value = DBNull.Value;//Application;
                        cmd.Parameters.Add("@pServiceNowCategoryID", SqlDbType.VarChar).Value = ServiceNowCategory;
                        cmd.Parameters.Add("@pServiceNowNumber", SqlDbType.VarChar).Value = ServiceNowNumber;
                        cmd.Parameters.Add("@pActivityID", SqlDbType.Int).Value = (Activity == "0") ? (object)DBNull.Value : Activity;
                        cmd.Parameters.Add("@pSubActivityID", SqlDbType.Int).Value = (SubActivity == "0") ? (object)DBNull.Value : SubActivity;
                        cmd.Parameters.Add("@pStartTime", SqlDbType.VarChar).Value = DBNull.Value;//StartTime;
                        cmd.Parameters.Add("@pEndTime", SqlDbType.VarChar).Value = DBNull.Value;//EndTime;
                        cmd.Parameters.Add("@pTimeSpent", SqlDbType.VarChar).Value = TimeSpent;
                        // cmd.Parameters.Add("@pIsKedb", SqlDbType.Bit).Value = Convert.ToBoolean(IsKeDB);
                        //  cmd.Parameters.Add("@pKedbLocation", SqlDbType.VarChar).Value = (System.Uri.UnescapeDataString(KedbLocation) == "") ? (object)DBNull.Value : System.Uri.UnescapeDataString(KedbLocation); ;
                        cmd.Parameters.Add("@pComments", SqlDbType.VarChar).Value = Comments;
                        con.Open();
                        cmd.ExecuteNonQuery();
                        con.Close();
                    }
                }
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
        }


        [WebMethod]
        public static string UpdateDailyTracker(int TrackerNumber, string Date, string Application, string ServiceNowCategory, string ServiceNowNumber, string Activity, string SubActivity,
            string StartTime, string EndTime, string TimeSpent, string Comments)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("QC_UpdateMSADailyTracker", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pTrackerNumber", SqlDbType.Int).Value = TrackerNumber;
                        cmd.Parameters.Add("@pDate", SqlDbType.Date).Value = Date;
                        cmd.Parameters.Add("@pUserName", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        cmd.Parameters.Add("@pApplicationID", SqlDbType.VarChar).Value = DBNull.Value;//Application;
                        cmd.Parameters.Add("@pServiceNowCategoryID", SqlDbType.VarChar).Value = ServiceNowCategory;
                        cmd.Parameters.Add("@pServiceNowNumber", SqlDbType.VarChar).Value = ServiceNowNumber;
                        cmd.Parameters.Add("@pActivityID", SqlDbType.Int).Value = (Activity == "0") ? (object)DBNull.Value : Activity;
                        cmd.Parameters.Add("@pSubActivityID", SqlDbType.Int).Value = (SubActivity == "0") ? (object)DBNull.Value : SubActivity;
                        cmd.Parameters.Add("@pStartTime", SqlDbType.VarChar).Value = DBNull.Value;//StartTime;
                        cmd.Parameters.Add("@pEndTime", SqlDbType.VarChar).Value = DBNull.Value;//EndTime;
                        cmd.Parameters.Add("@pTimeSpent", SqlDbType.VarChar).Value = TimeSpent;
                        cmd.Parameters.Add("@pComments", SqlDbType.VarChar).Value = Comments;
                        con.Open();
                        cmd.ExecuteNonQuery();
                        con.Close();
                    }
                }
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod]
        public static string SaveRRTracker(string ServiceNowNumber, string Application, string AssignmentDate, string ResponseTime, string RecoveryTime, string IsKeDB,
            string KedbLocation)
        {
            try
            {
                string retValue = "0";
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("QC_SavetblResponseRecoveryTracker", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pServiceNowNumber", SqlDbType.VarChar).Value = ServiceNowNumber;
                        cmd.Parameters.Add("@pApplicationID", SqlDbType.VarChar).Value = Application;
                        cmd.Parameters.Add("@pAssignmentDate", SqlDbType.DateTime).Value = AssignmentDate;//(Activity == "0") ? (object)DBNull.Value : Activity;
                        cmd.Parameters.Add("@pResponseDate", SqlDbType.DateTime).Value = ResponseTime;
                        cmd.Parameters.Add("@pRecoveryDate", SqlDbType.DateTime).Value = (RecoveryTime == "") ? (object)DBNull.Value : RecoveryTime;//RecoveryTime;
                        cmd.Parameters.Add("@pIsKedb", SqlDbType.Bit).Value = Convert.ToBoolean(IsKeDB);
                        cmd.Parameters.Add("@pKedbLocation", SqlDbType.VarChar).Value = (System.Uri.UnescapeDataString(KedbLocation) == "") ? (object)DBNull.Value : System.Uri.UnescapeDataString(KedbLocation); ;
                        cmd.Parameters.Add("@pUserName", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        con.Open();
                        // cmd.ExecuteScalar();
                        object o = cmd.ExecuteScalar();
                        if (o != null)
                        {
                            retValue = o.ToString();
                        }
                        con.Close();
                    }
                }
                return retValue.ToString();
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod]
        public static string UpdateRRTracker(int TrackerNumber, string ServiceNowNumber, string Application, string AssignmentDate, string ResponseTime, string RecoveryTime, string IsKeDB,
        string KedbLocation)
        {
            try
            {
                string retValue = "0";
                using (SqlConnection con = new SqlConnection(@"Data Source=10.172.4.82; Initial Catalog=QC; Uid=sa; pwd=welcome;"))
                {
                    using (SqlCommand cmd = new SqlCommand("QC_UpdateRRTracker", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pTrackerNumber", SqlDbType.Int).Value = TrackerNumber;
                        cmd.Parameters.Add("@pServiceNowNumber", SqlDbType.VarChar).Value = ServiceNowNumber;
                        cmd.Parameters.Add("@pApplicationID", SqlDbType.VarChar).Value = Application;
                        cmd.Parameters.Add("@pAssignmentDate", SqlDbType.DateTime).Value = AssignmentDate;//(Activity == "0") ? (object)DBNull.Value : Activity;
                        cmd.Parameters.Add("@pResponseDate", SqlDbType.DateTime).Value = ResponseTime;
                        cmd.Parameters.Add("@pRecoveryDate", SqlDbType.DateTime).Value = RecoveryTime;
                        cmd.Parameters.Add("@pIsKedb", SqlDbType.Bit).Value = Convert.ToBoolean(IsKeDB);
                        cmd.Parameters.Add("@pKedbLocation", SqlDbType.VarChar).Value = (System.Uri.UnescapeDataString(KedbLocation) == "") ? (object)DBNull.Value : System.Uri.UnescapeDataString(KedbLocation); ;
                        cmd.Parameters.Add("@pUserName", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        con.Open();
                        //cmd.ExecuteScalar();
                        object o = cmd.ExecuteScalar();
                        if (o != null)
                        {
                            retValue = o.ToString();
                        }
                        con.Close();

                    }
                }
                return retValue.ToString(); ;
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod]
        public static string DeleteDailyTracker(int TrackerNumber)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("QC_DeleteMSADailyTracker", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pTrackerNumber", SqlDbType.Int).Value = TrackerNumber;

                        con.Open();
                        cmd.ExecuteNonQuery();
                        con.Close();

                    }
                }
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod]
        public static string DeleteRRTracker(int TrackerNumber)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("QC_DeleteRRTracker", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pTrackerNumber", SqlDbType.Int).Value = TrackerNumber;

                        con.Open();
                        cmd.ExecuteNonQuery();
                        con.Close();

                    }
                }
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod(EnableSession = true)]
        public static string TestSessionExists()
        {
            if (System.Web.HttpContext.Current.Session["UserName"] != null)
            {
                return "1";
            }
            else
            {
                return "0";
            }
        }


        [WebMethod]
        public static string UserLogOFF()
        {
            try
            {
                HttpContext.Current.Session["UserName"] = null;
                HttpContext.Current.Session.Clear();
                HttpContext.Current.Session.Abandon();
                HttpContext.Current.Session.RemoveAll();
                if (HttpContext.Current.Request.Cookies["ASP.NET_SessionId"] != null)
                {
                    HttpContext.Current.Response.Cookies["ASP.NET_SessionId"].Value = string.Empty;
                }
                else
                {
                    HttpContext.Current.Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
                }
                HttpContext.Current.Response.Cookies["ASP.NET_SessionId"].Expires = DateTime.Now.AddMonths(-20);

                //   HttpContext.Current.Response.Redirect("Login.aspx", false);
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        ///////////////////////

        [WebMethod]
        public static IEnumerable GetHMTasks()
        {
            try
            {
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Proc_Kedb", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@ODCLANID", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        con.Open();
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        da.Fill(dt);
                        con.Close();
                        var HMInfo = dt.AsEnumerable().Select(r => new
                        {
                            //KeDBID = r[0].ToString(),
                            TicketNumber = r[0].ToString(),
                            IsKeDB = r[1].ToString(),
                            KedbNumber = r[2].ToString(),
                            Comments = r[3].ToString(),
                            UpdatedDate = r[4].ToString(),
                            UpdatedBy = r[5].ToString()

                        });
                        return HMInfo;
                    }
                }
            }
            catch (Exception ex)
            {
                return "0";
            }
        }


        [WebMethod]
        public static string updateKedbTable(string itemNumber, string kedbAvailable, string KedbNumber, string comments)
        {

            try
            {
                //string retValue1 = "0";
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    using (SqlCommand sqlCmd = new SqlCommand("Proc_InsertingValuesofKeDB", con))
                    {
                        sqlCmd.CommandType = CommandType.StoredProcedure;
                        sqlCmd.Parameters.Add("@ServiceNowEntries", SqlDbType.VarChar).Value = itemNumber;
                        sqlCmd.Parameters.Add("@IsKedb", SqlDbType.Char).Value = kedbAvailable;
                        sqlCmd.Parameters.Add("@KedbNumber", SqlDbType.VarChar).Value = (KedbNumber == "0") ? (object)DBNull.Value : KedbNumber;
                        sqlCmd.Parameters.Add("@Comments", SqlDbType.VarChar).Value = comments;
                        //sqlCmd.Parameters.Add("@UpdatedDate", SqlDbType.Date).Value = DateTime.Now.ToShortDateString();
                        //sqlCmd.Parameters.Add("@Updatedby", SqlDbType.VarChar).Value = "nirmal_a";
                        sqlCmd.Parameters.Add("@Updatedby", SqlDbType.VarChar).Value = System.Web.HttpContext.Current.Session["UserName"].ToString();
                        con.Open();
                        // cmd.ExecuteScalar();
                        sqlCmd.ExecuteNonQuery();

                        con.Close();
                    }
                }
                return "1";
            }
            catch (Exception ex)
            {
                return "0";
            }
        }

        [WebMethod]
        public static string Automate_Kedb_Update()
        {
            string ServiceEntry = string.Empty;
            string KedbNum = string.Empty;
            string Updatedby = string.Empty;
            try
            {
                //string retValue1 = "0";
                using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
                {
                    
                    SqlCommand sqlCmd = new SqlCommand("sp_kedbstatusupdate", con);
                    sqlCmd.CommandType = CommandType.StoredProcedure;
                        con.Open();
                        SqlDataAdapter da = new SqlDataAdapter(sqlCmd);
                        DataTable dt1 = new DataTable();
                        da.Fill(dt1);
                        con.Close();
                        if (dt1.Rows.Count != 0)
                        {

                            foreach (DataRow Dr in dt1.Rows)
                            {
                                ServiceEntry = Dr["ServiceNumber"].ToString();
                                KedbNum = Dr["Kedb_Number"].ToString();
                                Updatedby = Dr["ODCLanID"].ToString();
                                //string Sqlquery = "insert into tblkeDB values ('" + ServiceEntry + "','Yes','" + KedbNum + "','Created',getdate(),'" + Updatedby + "')";
                                //string Sqlquery = "update tblkeDB set ServiceNowEntries='" + ServiceEntry + "',IsKedb='Yes',KedbNumber='" + KedbNum + "',Comments='Created',UpdatedDate=getdate(),Updatedby='" + Updatedby + "'where ServiceNowEntries='" + ServiceEntry + "'";
                                using (SqlCommand sqlCmd1 = new SqlCommand("sp_Kedbstatusupdatebyinsert", con))
                                {
                                    con.Open();
                                    sqlCmd1.CommandType = CommandType.StoredProcedure;
                                    sqlCmd1.Parameters.Add("@ServiceEntry", SqlDbType.VarChar).Value = ServiceEntry;
                                    sqlCmd1.Parameters.Add("@IsKedb", SqlDbType.VarChar).Value = "Yes";
                                    sqlCmd1.Parameters.Add("@KedbNum", SqlDbType.VarChar).Value =KedbNum;
                                    sqlCmd1.Parameters.Add("@Comments", SqlDbType.VarChar).Value = "Created";
                                    sqlCmd1.Parameters.Add("@Date", SqlDbType.DateTime).Value = DateTime.Now;
                                    sqlCmd1.Parameters.Add("@Updatedby", SqlDbType.VarChar).Value = Updatedby;
                                    sqlCmd1.ExecuteNonQuery();
                                    con.Close();
                                }
                            }
                        }

                                          
                    
                }
                return "1";
                
            }
                
            catch (Exception)
            {
                return "0";
            }
        }


        [WebMethod]
        public static IEnumerable drpkedb()
        {
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["DbConn"].ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("Proc_drpkedb", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    con.Open();

                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    da.Fill(dt);

                    var kedbnum = dt.AsEnumerable().Select(r => new
                    {
                        Kedb_Number = r[0].ToString(),
                        Kedb_Keywords = r[1].ToString()
                    });

                    return kedbnum;
                }
            }
        }

       
    }
}