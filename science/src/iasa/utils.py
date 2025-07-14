import pandas as pd  # noqa: F401
from pyam import IamDataFrame, Statistics, filter_by_meta  # noqa: F401

def create_iamdf(df, metaindicators=None):
    """
    Create an IamDataFrame from the API response.
    """

    return IamDataFrame(
        df.rename(columns={"step_year": "year"}).drop(columns=["id"], axis=1),
        meta=metaindicators,
    )


def create_df_from_api_response(valid_response):
    """
    Create a pandas DataFrame from the API response.
    """
    results = valid_response.get("results", {})
    # Convert the results to a IamDataFrame
    d_types = results.get("dtypes", [])
    results.pop("dtypes", None)
    mapping_types = dict(zip(results.get("columns", []), d_types))

    return pd.DataFrame(**results).astype(dtype=mapping_types, errors="ignore")