using System;
using System.Collections;
using System.Collections.Generic;
using System.DirectoryServices;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace jQGridExample
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }



        [WebMethod]
        public static IEnumerable ValidateLogin(string UserName, string Password)
        {
            string Response = string.Empty;
            var status = new object();
            Password = "Work39aig";

            try
            {
                DirectoryEntry entry = new DirectoryEntry("LDAP://r1-core.r1.aig.net/DC=r1-core,DC=r1,DC=aig,DC=net", @"R1-CORE\" + UserName.Trim(), Password.Trim());
                object obj = entry.NativeObject;
                //  DirectorySearcher ds = new DirectorySearcher(entry);
                //  ds.Filter = "(&(objectClass=user)(objectCategory=person)(sAMAccountName=" + entry.Username + "))";

                status = new
               {
                   Response = "1"
               };
                status = "1";
                System.Web.HttpContext.Current.Session["UserName"] = UserName.Trim().ToString();
                //Session["UserName"] = UserName.Trim();
            }
            catch
            {
                // status = new
                //{
                //    Response = "0"
                //};
                status = "0";
            }
            return status.ToString();
        }

        public static string GetProperty(SearchResult searchResult, string PropertyName)
        {
            if (searchResult.Properties.Contains(PropertyName))
            {
                return searchResult.Properties[PropertyName][0].ToString();
            }
            else
            {
                return string.Empty;
            }
        }


    }
}